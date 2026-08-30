const { withContentlayer } = require('next-contentlayer')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is *.vercel-insights.com *.googletagmanager.com *.google-analytics.com *.google.com va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src 'self' *.google-analytics.com *.googletagmanager.com *.gstatic.com vitals.vercel-insights.com vercel.com *.vercel-insights.com *.vercel.app *.sentry.io;
  font-src 'self' *.gstatic.com *.googleapis.com;
  frame-src giscus.app *.google.com
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  // X-Robots-Tag to explicitly allow indexing
  {
    key: 'X-Robots-Tag',
    value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
]

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
    },
    swcMinify: true,
    compiler: {
      removeConsole:
        process.env.NODE_ENV === 'production'
          ? {
              exclude: ['error', 'warn'],
            }
          : false,
    },

    poweredByHeader: false,
    images: {
      formats: ['image/avif', 'image/webp'],
      domains: ['hits.sh'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: '**',
          port: '',
          pathname: '/**',
        },
      ],
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
        // 참고: 문서 경로는 Accept 에 따라 HTML/마크다운으로 갈라 응답하지만(middleware.ts),
        // HTML 응답의 Vary 는 여기서 손댈 수 없다. Next 가 페이지 응답의 Vary 를
        // 'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding' 으로 마지막에
        // 덮어쓰기 때문에 headers() 로 지정한 Vary 는 사라진다.
        // 마크다운 응답 쪽 Vary 는 app/md/[...slug]/route.ts 에서 직접 붙이고 있고,
        // 변형이 섞이는 문제는 middleware 가 마크다운 요청을 별도 경로로 rewrite 해
        // 캐시 키 자체를 분리하는 것으로 막는다.
      ]
    },
    async redirects() {
      return [
        {
          source: '/blog/:path*',
          destination: '/posts/:path*',
          permanent: true,
        },
        {
          source: '/posts/resignation',
          destination: '/retrospections/resignation',
          permanent: true,
        },
        // legacy reflection routes → retrospections

        {
          source: '/reflections/:path*',
          destination: '/retrospections/:path*',
          permanent: true,
        },
        {
          source: '/reflection/:path*',
          destination: '/retrospections/:path*',
          permanent: true,
        },
        {
          source: '/posts/_next/:path*',
          destination: '/_next/:path*',
          permanent: false,
        },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })
      config.optimization.minimize = true

      return config
    },
  })
}

// Sentry configuration - only active when auth token is available
const { withSentryConfig } = require('@sentry/nextjs')

const sentryConfig = {
  org: 'lapidix',
  project: 'blog',

  // Only use auth token if available and valid
  authToken:
    process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_AUTH_TOKEN !== 'undefined'
      ? process.env.SENTRY_AUTH_TOKEN
      : undefined,

  // Silent mode when no token
  silent: !process.env.SENTRY_AUTH_TOKEN,

  // Upload source maps only when auth token is available
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN || process.env.SENTRY_AUTH_TOKEN === 'undefined',
    deleteSourcemapsAfterUpload: true,
  },

  // Skip operations when no auth token
  dryRun: !process.env.SENTRY_AUTH_TOKEN || process.env.SENTRY_AUTH_TOKEN === 'undefined',

  // Other configurations
  tunnelRoute: '/monitoring',
  disableLogger: true,
  automaticVercelMonitors: true,
}

// Always apply Sentry config, but disable features when no auth token
module.exports = withSentryConfig(module.exports, sentryConfig)

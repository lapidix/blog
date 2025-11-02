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
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'min71.dev',
            },
          ],
          destination: 'https://lapidix.dev/:path*',
          permanent: true,
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

// Only apply Sentry config if we have a valid auth token
module.exports =
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_AUTH_TOKEN !== 'undefined'
    ? withSentryConfig(module.exports, sentryConfig)
    : module.exports

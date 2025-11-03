import * as Sentry from '@sentry/nextjs'
import 'css/tailwind.css'
import { Space_Grotesk } from 'next/font/google'
// import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import GoogleAnalytics from '@/components/common/atoms/GoogleAnalytics'
import SectionContainer from '@/components/common/atoms/SectionContainer'
import Footer from '@/components/common/molecules/Footer'
import Header from '@/components/header/organisms/Header'
import siteMetadata from '@/data/siteMetadata'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import { SearchConfig, SearchProvider } from 'pliny/search'
import { ThemeProviders } from './theme-providers'
// import { KBarProvider } from 'kbar'
const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: '%s',
  },
  description: siteMetadata.description,
  keywords: [
    '개발',
    'Blog',
    'Development',
    'Programming',
    'Web Development',
    'Software Engineering',
    'Tech Blog',
    'React',
    'Next.js',
    'JavaScript',
    'TypeScript',
  ],
  authors: [{ name: siteMetadata.author }],
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
  other: {
    ...Sentry.getTraceData(),
  },
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html
      lang={params.lang ?? 'ko'}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* LCP 최적화를 위한 사전 연결 및 사전 로드 */}
        <link rel="preconnect" href={siteMetadata.siteUrl} />
        <link rel="preconnect" href="https://lapidix.dev" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://giscus.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* 파비콘 및 기본 메타 태그 */}
        <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/static/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f1f1f1" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta name="naver-site-verification" content="e81e6e126603dd692215c6a310f910212f74c463" />
        <meta
          name="google-site-verification"
          content="BmBwdNWRqcNIxTL4GvqckRWEP1JS-Z7_2xVDhaCdYNE"
        />

        {/* 구조화된 데이터 - WebSite 스키마 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteMetadata.title,
              description: siteMetadata.description,
              url: siteMetadata.siteUrl,
              author: {
                '@type': 'Person',
                name: siteMetadata.author,
                email: siteMetadata.email,
                url: siteMetadata.siteUrl,
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteMetadata.siteUrl}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Organization 스키마 제거 - 검색 결과에 사이트 이름 추가 방지 */}
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteMetadata.title,
              url: siteMetadata.siteUrl,
              logo: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
              description: siteMetadata.description,
              sameAs: [siteMetadata.github, siteMetadata.twitter, siteMetadata.linkedin].filter(
                Boolean
              ),
            }),
          }}
        /> */}
        {/* <script
          async
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="49768dc7-9d09-41de-8b65-38049ca7d81d"
        /> */}
      </head>

      <body className="bg-white text-black antialiased dark:bg-gray-800 dark:text-white">
        <ThemeProviders>
          <Analytics />
          <GoogleAnalytics />
          <SectionContainer>
            <div className="flex h-screen flex-col justify-between font-sans">
              <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
                <Header />
                <main className="mb-auto">{children}</main>
              </SearchProvider>
              <Footer />
            </div>
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}

import siteMetadata from '@/data/siteMetadata'
import { MetadataRoute } from 'next'

// 정적 생성 강제 및 재검증 비활성화
export const dynamic = 'force-static'
export const revalidate = false

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/search'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/private/'],
        crawlDelay: 0, // Google 크롤러에 대한 제한 없음
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/private/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Yeti', // 네이버 검색엔진
        allow: '/',
        disallow: ['/api/', '/private/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Daum', // 다음 검색엔진
        allow: '/',
        disallow: ['/api/', '/private/'],
        crawlDelay: 0,
      },
      // === AI 검색 인용용 봇 (allow) ===
      // 사용자 질의 시 실시간 fetch 또는 AI 검색 인덱싱에 사용되는 봇은 허용해
      // 답변 결과에 사이트가 출처로 인용되도록 한다.
      {
        userAgent: 'OAI-SearchBot', // OpenAI SearchGPT 인덱싱
        allow: '/',
        disallow: ['/api/', '/private/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT 사용자 트리거 fetch
        allow: '/',
        disallow: ['/api/', '/private/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'PerplexityBot', // Perplexity 검색 인덱싱
        allow: '/',
        disallow: ['/api/', '/private/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Perplexity-User', // Perplexity 사용자 트리거 fetch
        allow: '/',
        disallow: ['/api/', '/private/'],
        crawlDelay: 0,
      },
      // === AI 학습용 봇 (disallow) ===
      // 모델 학습 데이터 수집용 봇은 차단한다. 검색/인용 봇과 분리되어 있어
      // 차단해도 AI 답변 노출에는 영향을 주지 않는다.
      { userAgent: 'GPTBot', disallow: '/' }, // OpenAI 학습
      { userAgent: 'ClaudeBot', disallow: '/' }, // Anthropic 학습
      { userAgent: 'anthropic-ai', disallow: '/' }, // Anthropic 학습
      { userAgent: 'Claude-Web', disallow: '/' }, // Anthropic 학습
      { userAgent: 'Google-Extended', disallow: '/' }, // Gemini 학습 (Googlebot 검색은 별도)
      { userAgent: 'Applebot-Extended', disallow: '/' }, // Apple Intelligence 학습
      { userAgent: 'CCBot', disallow: '/' }, // Common Crawl
      { userAgent: 'Bytespider', disallow: '/' }, // ByteDance/Doubao 학습
      { userAgent: 'Meta-ExternalAgent', disallow: '/' }, // Meta 학습
      { userAgent: 'FacebookBot', disallow: '/' }, // Meta 학습
      { userAgent: 'Diffbot', disallow: '/' },
      { userAgent: 'Omgilibot', disallow: '/' },
    ],
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}

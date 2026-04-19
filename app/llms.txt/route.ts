import siteMetadata from '@/data/siteMetadata'
import { allBlogs } from 'contentlayer/generated'

export const dynamic = 'force-static'
export const revalidate = 3600

function isEnglish(post: { locale?: string; path: string }) {
  return post.locale === 'en' || post.path.startsWith('en/')
}

function isKorean(post: { locale?: string; path: string }) {
  return post.locale === 'ko' || (!post.locale && !post.path.startsWith('en/'))
}

export async function GET() {
  const sortedPosts = allBlogs
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const koreanPosts = sortedPosts.filter(isKorean)
  const englishPosts = sortedPosts.filter(isEnglish)

  const formatPost = (post: (typeof sortedPosts)[number]) => {
    const url = post.canonicalUrl || `${siteMetadata.siteUrl}/${post.path}`
    const summary = post.summary?.replace(/\s+/g, ' ').trim() ?? ''
    return summary ? `- [${post.title}](${url}): ${summary}` : `- [${post.title}](${url})`
  }

  const lines: string[] = [
    `# ${siteMetadata.title}`,
    '',
    `> ${siteMetadata.description}`,
    '',
    `Author: ${siteMetadata.author}`,
    `Site: ${siteMetadata.siteUrl}`,
    `Contact: ${siteMetadata.email}`,
    '',
    '## Korean Posts',
    '',
    ...koreanPosts.map(formatPost),
    '',
    '## English Posts',
    '',
    ...englishPosts.map(formatPost),
    '',
    '## Optional',
    '',
    `- [Full Content (llms-full.txt)](${siteMetadata.siteUrl}/llms-full.txt): All blog posts concatenated as a single text file for full-context ingestion`,
    `- [RSS Feed](${siteMetadata.siteUrl}/feed.xml)`,
    `- [Sitemap](${siteMetadata.siteUrl}/sitemap.xml)`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

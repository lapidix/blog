import siteMetadata from '@/data/siteMetadata'
import { allBlogs } from 'contentlayer/generated'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const sortedPosts = allBlogs
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const header = [
    `# ${siteMetadata.title} — Full Content`,
    '',
    `> ${siteMetadata.description}`,
    '',
    `Author: ${siteMetadata.author}`,
    `Site: ${siteMetadata.siteUrl}`,
    `Generated: ${new Date().toISOString()}`,
    `Total posts: ${sortedPosts.length}`,
    '',
    'This file concatenates every blog post in raw Markdown so that AI agents can ingest the full corpus in a single fetch. Each post is delimited by a `---` separator and prefixed with metadata.',
    '',
    '====================================================================',
    '',
  ].join('\n')

  const sections = sortedPosts.map((post) => {
    const url = post.canonicalUrl || `${siteMetadata.siteUrl}/${post.path}`
    const locale = post.locale === 'en' || post.path.startsWith('en/') ? 'en' : 'ko'
    const tags = Array.isArray(post.tags) ? post.tags.join(', ') : ''

    const meta = [
      `## ${post.title}`,
      '',
      `- URL: ${url}`,
      `- Locale: ${locale}`,
      `- Date: ${post.date}`,
      tags ? `- Tags: ${tags}` : '',
      post.summary ? `- Summary: ${post.summary}` : '',
      '',
    ]
      .filter(Boolean)
      .join('\n')

    return `${meta}\n${post.body.raw.trim()}\n\n---\n`
  })

  const body = `${header}\n${sections.join('\n')}`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

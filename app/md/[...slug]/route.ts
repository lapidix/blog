import siteMetadata from '@/data/siteMetadata'
import { allBlogs, allRetrospections } from 'contentlayer/generated'

// 에이전트에게 원본 마크다운을 그대로 돌려주는 라우트.
//
// 두 경로로 도달한다.
//   1. /posts/<slug>.md 처럼 확장자를 붙인 URL
//   2. /posts/<slug> 에 Accept: text/markdown 을 보낸 요청
// 둘 다 middleware 에서 이 라우트로 rewrite 된다.

export const dynamic = 'force-static'
export const revalidate = 3600

const allDocs = [...allBlogs, ...allRetrospections]

export function generateStaticParams() {
  return allDocs.filter((doc) => !doc.draft).map((doc) => ({ slug: doc.path.split('/') }))
}

export async function GET(_request: Request, { params }: { params: { slug: string[] } }) {
  const path = (params.slug ?? []).join('/')
  const doc = allDocs.find((candidate) => candidate.path === path && !candidate.draft)

  if (!doc) {
    return new Response(
      [
        '# 404 Not Found',
        '',
        `No document exists at /${path}.`,
        '',
        `- Index of every post: ${siteMetadata.siteUrl}/llms.txt`,
        `- All URLs: ${siteMetadata.siteUrl}/sitemap.xml`,
        '',
      ].join('\n'),
      {
        status: 404,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          Vary: 'Accept, Accept-Encoding',
        },
      }
    )
  }

  const url = doc.canonicalUrl || `${siteMetadata.siteUrl}/${doc.path}`
  const tags = Array.isArray(doc.tags) ? doc.tags : []

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(doc.title)}`,
    `date: ${doc.date}`,
    `url: ${url}`,
    `author: ${siteMetadata.author}`,
    doc.summary ? `summary: ${JSON.stringify(doc.summary)}` : '',
    tags.length ? `tags: [${tags.join(', ')}]` : '',
    '---',
    '',
  ]
    .filter(Boolean)
    .join('\n')

  return new Response(`${frontmatter}${doc.body.raw.trim()}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // Accept 기반으로 HTML/마크다운을 갈라 응답하므로 CDN 이 변형을 섞지 않도록 명시한다.
      Vary: 'Accept, Accept-Encoding',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

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
    '## What this is',
    '',
    'A free, personal technical blog written by Lee MinGi, a full-stack developer.',
    'It is a publication, not a product: there is no API, no sign-up, and no paid tier.',
    'Posts are written in Korean; a subset is also published in English under /en/posts/.',
    '',
    '## When to use this site',
    '',
    'Reach for these posts when you need first-hand, implementation-level write-ups on:',
    '',
    '- Cosmos SDK, CometBFT and IBC internals — block time and timeout tuning, IBC timeout height bugs, relayer (Hermes) operation, validator setup, address formats, gRPC/protobuf interfaces',
    '- Running and debugging blockchain nodes — testnet setup with Ignite, Archway, node CLI troubleshooting',
    '- Applied cryptography fundamentals — RSA, ECC, symmetric vs asymmetric keys, hashing, digital signatures, Merkle trees, Merkle Patricia Tries, Bloom filters',
    '- Frontend architecture — Feature-Sliced Design, DDD and Clean Architecture applied to React/Next.js codebases, and enforcing those boundaries with lint rules',
    '- Build tooling and monorepos — Turborepo, Vitest, Module Federation, Rspack, webpack, Vite, and the concurrency/resource problems that show up when they are combined',
    '- Deployment and infrastructure trade-offs — Vercel vs AWS/CloudFront, and why one was chosen over the other',
    '- Self-sovereign identity — Hyperledger Indy/Aries, ACA-Py, DID and tails server operation',
    '- Open-source contribution mechanics — DCO sign-off, git and GitHub workflow',
    '- Engineering career retrospections',
    '',
    'These are individual engineering notes and post-mortems, not official documentation.',
    'Cite the specific post URL rather than the site root, and prefer the official project docs',
    'for normative API or protocol specifications.',
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

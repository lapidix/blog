import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/posts/organisms/MDXComponents'
import siteMetadata from '@/data/siteMetadata'
import PostBanner from '@/layouts/PostBanner'
import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'
import { capturePostNotFound } from '@/libs/sentry-utils'
import type { Authors } from 'contentlayer/generated'
import { allAuthors, allRetrospections } from 'contentlayer/generated'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { allCoreContent, coreContent, sortPosts } from 'pliny/utils/contentlayer.js'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata> {
  const slug = decodeURI(params.slug.join('/'))
  const sortedCoreContents = allCoreContent(sortPosts(allRetrospections))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)

  if (postIndex === -1) {
    return {
      title: 'Retrospection Not Found',
      description: 'The requested retrospection could not be found.',
    }
  }

  const post = allRetrospections.find((p) => p.slug === slug)
  if (!post) {
    return {
      title: 'Retrospection Not Found',
      description: 'The requested retrospection could not be found.',
    }
  }

  const authorList = post.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  let featuredImage = siteMetadata.socialBanner

  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
    featuredImage = imageList[0]
  }

  const keywords = post.tags || []
  const postUrl = `${siteMetadata.siteUrl}/retrospections/${post.slug}`
  return {
    title: {
      absolute: post.title,
    },
    description: post.summary,
    keywords: keywords.join(', '),
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: postUrl,
      images: [featuredImage],
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
      type: 'article',
    },
    twitter: {
      title: post.title,
      card: 'summary_large_image',
      images: [featuredImage],
    },
  }
}
export const generateStaticParams = async () => {
  const paths = allRetrospections.map((p) => ({ slug: p.slug.split('/') }))

  return paths
}

export default async function Page({ params }: { params: { slug: string[]; locale: string } }) {
  const slug = decodeURI(params.slug.join('/'))

  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allRetrospections))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    await capturePostNotFound(slug, 'retrospection_post', 'Page')
    notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allRetrospections.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData

  // JSON-LD 구조화된 데이터 개선
  const postUrl = `${siteMetadata.siteUrl}/retrospections/${post.slug}`
  jsonLd['@context'] = 'https://schema.org'
  jsonLd['@type'] = 'BlogPosting'
  jsonLd['mainEntityOfPage'] = {
    '@type': 'WebPage',
    '@id': postUrl,
  }
  jsonLd['headline'] = post.title
  jsonLd['description'] = post.summary
  jsonLd['keywords'] = post.tags ? post.tags.join(', ') : ''
  jsonLd['image'] = post.images
    ? Array.isArray(post.images)
      ? post.images.map((img) => {
          if (typeof img === 'string') {
            return img.startsWith('http') ? img : `${siteMetadata.siteUrl}${img}`
          }
          return ''
        })
      : [post.images.startsWith('http') ? post.images : `${siteMetadata.siteUrl}${post.images}`]
    : [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`]
  jsonLd['datePublished'] = new Date(post.date).toISOString()
  jsonLd['dateModified'] = new Date(post.lastmod || post.date).toISOString()
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
      url: siteMetadata.siteUrl,
    }
  })
  jsonLd['publisher'] = {
    '@type': 'Organization',
    name: siteMetadata.author,
    url: siteMetadata.siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}/static/images/logo.png`,
      width: '192',
      height: '192',
    },
  }
  jsonLd['url'] = postUrl
  if (post.tags && post.tags.length > 0) {
    jsonLd['articleSection'] = post.tags[0]
  }
  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}

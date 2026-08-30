import siteMetadata from '@/data/siteMetadata'
import type { Blog, Retrospection } from 'contentlayer/generated'
import { allBlogs, allRetrospections } from 'contentlayer/generated'
import { MetadataRoute } from 'next'

type SitemapEntry = {
  url: string
  lastModified: string
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

function calculatePriority(post: Blog | Retrospection): number {
  const postDate = new Date(post.date)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff <= 30) return 0.9
  if (daysDiff <= 90) return 0.8
  if (daysDiff <= 180) return 0.7
  if (daysDiff <= 365) return 0.6
  return 0.5
}

function getChangeFrequency(
  post: Blog | Retrospection
): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  const postDate = new Date(post.date)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff <= 7) return 'weekly' // 최근 7일
  if (daysDiff <= 30) return 'monthly' // 최근 30일
  return 'yearly' // 그 이상
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  // retrospections 도 공개 문서이므로 sitemap 에 포함한다.
  const blogRoutes: SitemapEntry[] = [...allBlogs, ...allRetrospections]
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
      changeFrequency: getChangeFrequency(post),
      priority: calculatePriority(post),
    }))

  const staticRoutes: SitemapEntry[] = [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/posts`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/retrospections`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/tags`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/llms-full.txt`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  return [...staticRoutes, ...blogRoutes]
}

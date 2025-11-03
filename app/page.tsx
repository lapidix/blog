import MainPage from '@/components/main/pages/MainPage'
import {
  allAuthors,
  allBlogs,
  allReflections,
  Authors,
  Blog,
  Reflection,
} from 'contentlayer/generated'
import { allCoreContent, CoreContent, sortPosts } from 'pliny/utils/contentlayer.js'

interface PostWithViews extends CoreContent<Blog | Reflection> {
  views: number
}

async function getTrendingPosts(): Promise<PostWithViews[]> {
  try {
    const { kv } = await import('@vercel/kv')

    const trendingSlugs = await kv.zrange('trending:posts', 0, 4, {
      rev: true,
      withScores: true,
    })

    const posts = allCoreContent(sortPosts(allBlogs))
    const reflectionPosts = allCoreContent(sortPosts(allReflections))
    const allPosts = [...posts, ...reflectionPosts]
    const trendingPosts: PostWithViews[] = []

    if (trendingSlugs && trendingSlugs.length > 0) {
      for (let i = 0; i < trendingSlugs.length; i += 2) {
        const slug = trendingSlugs[i] as string
        const views = trendingSlugs[i + 1] as number

        const post = allPosts.find((p) => p.slug === slug)
        if (post) {
          trendingPosts.push({
            ...post,
            views: views,
          })
        }
      }
    }

    if (trendingPosts.length < 4) {
      const usedSlugs = new Set(trendingPosts.map((p) => p.slug))

      const remainingPosts = posts
        .filter((post) => !usedSlugs.has(post.slug))
        .slice(0, 4 - trendingPosts.length)
        .map((post) => ({
          ...post,
          views: 0,
        }))

      trendingPosts.push(...remainingPosts)
    }

    return trendingPosts
  } catch (error) {
    console.error('Failed to fetch trending posts from KV:', error)

    const { captureKVError } = await import('@/libs/sentry-utils')
    captureKVError(error as Error, 'get_trending_posts', {
      location: 'HomePage',
    })

    // 오류 발생 시 최신 글 4개 반환
    const sortedPosts = sortPosts(allBlogs)
    const posts = allCoreContent(sortedPosts)
    return posts.slice(0, 4).map((post) => ({ ...post, views: 0 }))
  }
}

export default async function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const trendingPosts = await getTrendingPosts()

  return <MainPage posts={trendingPosts} author={author} />
}

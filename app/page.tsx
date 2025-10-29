import MainPage from '@/components/main/pages/MainPage'
import { allAuthors, allBlogs, Authors, Blog } from 'contentlayer/generated'
import { allCoreContent, CoreContent, sortPosts } from 'pliny/utils/contentlayer.js'

interface PostWithViews extends CoreContent<Blog> {
  views: number
}

async function getTrendingPosts(): Promise<PostWithViews[]> {
  try {
    // 서버 사이드에서는 절대 URL이 아닌 상대 경로 사용
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const response = await fetch(`${baseUrl}/api/trending-posts`, {
      // 서버 사이드 렌더링에서 캐시 방지
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(`API response not ok: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch trending posts: ${response.status}`)
    }

    const trendingPosts = (await response.json()) as PostWithViews[]
    console.log('Fetched trending posts:', trendingPosts.length)
    return trendingPosts
  } catch (error) {
    console.error('Error getting trending posts:', error)
    // 에러 발생 시 최신 포스트 4개를 fallback으로 반환
    const sortedPosts = sortPosts(allBlogs)
    const posts = allCoreContent(sortedPosts)
    return posts.slice(0, 4).map((post) => ({ ...post, views: 0 }))
  }
}

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const trendingPosts = await getTrendingPosts()

  return <MainPage posts={trendingPosts} author={author} />
}

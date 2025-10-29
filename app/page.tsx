import MainPage from '@/components/main/pages/MainPage'
import { allAuthors, allBlogs, Authors, Blog } from 'contentlayer/generated'
import { allCoreContent, CoreContent, sortPosts } from 'pliny/utils/contentlayer.js'

interface PostWithViews extends CoreContent<Blog> {
  views: number
}

async function getTrendingPosts(): Promise<PostWithViews[]> {
  try {
    // 상대 경로 사용 - Next.js가 자동으로 적절한 URL로 변환함
    const response = await fetch(`/api/trending-posts`, {
      // ISR 방식으로 변경하여 정적 생성 가능
      next: { revalidate: 7200 },
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

import MainPage from '@/components/main/pages/MainPage'
import { allAuthors, allBlogs, Authors, Blog } from 'contentlayer/generated'
import { allCoreContent, CoreContent, sortPosts } from 'pliny/utils/contentlayer.js'

interface PostWithViews extends CoreContent<Blog> {
  views: number
}

async function getTrendingPosts(): Promise<PostWithViews[]> {
  try {
    const response = await fetch(`/api/trending-posts`, {
      next: { revalidate: 7200 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch trending posts: ${response.status}`)
    }

    const trendingPosts = (await response.json()) as PostWithViews[]

    // 인기 포스트가 4개 미만이면 최신 글로 채우기
    if (trendingPosts.length < 4) {
      const sortedPosts = sortPosts(allBlogs)
      const posts = allCoreContent(sortedPosts)

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

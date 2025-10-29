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
      console.error(`API response not ok: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch trending posts: ${response.status}`)
    }

    const trendingPosts = (await response.json()) as PostWithViews[]
    return trendingPosts
  } catch (error) {
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

import ListLayout from '@/layouts/ListLayoutWithTags'
// import ListLayout from '@/layouts/ListLayout'
import { Authors, allAuthors, allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import { genPageMetadata } from '../seo'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({
  title: 'Articles',
  description: 'Collection of blog articles',
  slug: 'posts',
})

export default function BlogPage() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const posts = allCoreContent(sortPosts(allBlogs.filter((p) => p.locale === 'ko')))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      author={author}
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Articles"
    />
  )
}

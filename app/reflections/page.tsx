import ListLayout from '@/layouts/ListLayoutWithTags'
// import ListLayout from '@/layouts/ListLayout'
import { Authors, Reflection, allAuthors, allReflections } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import { genPageMetadata } from '../seo'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({
  title: 'Reflection',
  description: 'Personal reflections and insights from my journey as a developer',
  slug: 'reflection',
})

export default function BlogPage() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const reflection = allCoreContent<Reflection>(sortPosts(allReflections))
  const pageNumber = 1
  const initialDisplayPosts = reflection.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(reflection.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      author={author}
      posts={reflection}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Reflections"
      description="Personal reflections and insights from my journey as a developer"
    />
  )
}

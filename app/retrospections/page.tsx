import ListLayout from '@/layouts/ListLayoutWithTags'
// import ListLayout from '@/layouts/ListLayout'
import { Authors, Retrospection, allAuthors, allRetrospections } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import { genPageMetadata } from '../seo'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({
  title: 'Retrospections',
  description: 'Personal retrospections and insights from my journey as a developer',
  slug: 'retrospection',
})

export default function BlogPage() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const retrospection = allCoreContent<Retrospection>(sortPosts(allRetrospections))
  const pageNumber = 1
  const initialDisplayPosts = retrospection.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(retrospection.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      author={author}
      posts={retrospection}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Retrospections"
      description="Personal retrospections and insights from my journey as a developer"
    />
  )
}

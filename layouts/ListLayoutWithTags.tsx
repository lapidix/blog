/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { ChevronLeftIcon } from '@/components/common/atoms/ChevronLeftIcon'
import { ChevronRightIcon } from '@/components/common/atoms/ChevronRightIcon'
import Link from '@/components/common/atoms/Link'
import PostContainer from '@/components/posts/organisms/PostContainer'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import { allAuthors, type Authors, type Blog, type Retrospection } from 'contentlayer/generated'
import { usePathname } from 'next/navigation'
import { CoreContent } from 'pliny/utils/contentlayer.js'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
type BlogLike = Blog | Retrospection
type CoreBlogLike = CoreContent<Blog> | CoreContent<Retrospection>
interface ListLayoutProps {
  posts: CoreBlogLike[]
  title: string
  initialDisplayPosts?: CoreBlogLike[]
  pagination?: PaginationProps
  author?: Authors
  description?: string
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  //
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5
    const sidePages = Math.floor(showPages / 2)

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      let start = Math.max(1, currentPage - sidePages)
      let end = Math.min(totalPages, currentPage + sidePages)

      if (currentPage <= sidePages + 1) {
        end = showPages
      }
      if (currentPage >= totalPages - sidePages) {
        start = totalPages - showPages + 1
      }

      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push('...')
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-center items-center gap-2">
        {prevPage ? (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 py-2 mt-0.5"
          >
            <ChevronLeftIcon className="size-4" />
          </Link>
        ) : (
          <div className="py-2 mt-0.5 text-gray-300 dark:text-gray-600">
            <ChevronLeftIcon className="size-4" />
          </div>
        )}

        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm font-medium text-gray-500"
              >
                ...
              </span>
            )
          }

          const isCurrentPage = page === currentPage
          const href = page === 1 ? `/${basePath}/` : `/${basePath}/page/${page}`

          return isCurrentPage ? (
            <span
              key={page}
              className="px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-md dark:bg-primary-400 dark:text-gray-900"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={href}
              className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              {page}
            </Link>
          )
        })}

        {nextPage ? (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 py-2 mt-0.5"
          >
            <ChevronRightIcon className="size-4" />
          </Link>
        ) : (
          <div className="py-2 mt-0.5 text-gray-300 dark:text-gray-600">
            <ChevronRightIcon className="size-4" />
          </div>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  description,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  // const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {description || siteMetadata.description}
          </p>
        </div>

        <div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayPosts.map((post) => {
              const { path, date, title, summary, tags } = post
              return (
                <li key={path} className="py-6 xl:pr-8">
                  <PostContainer post={post} author={author as Authors} />
                </li>
              )
            })}
          </ul>
          {pagination && pagination.totalPages > 1 && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </div>
    </>
  )
}

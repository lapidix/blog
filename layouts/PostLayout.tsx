import Image from '@/components/common/atoms/Image'
import Link from '@/components/common/atoms/Link'
import PageTitle from '@/components/common/atoms/PageTitle'
import SectionContainer from '@/components/common/atoms/SectionContainer'
import CustomTOC from '@/components/posts/molecules/CustomTOC'
import PostMetrics from '@/components/posts/molecules/PostMetrics'
import Comments from '@/components/posts/organisms/Comments'
import ScrollTopAndComment from '@/components/posts/organisms/ScrollTopAndComment'

import Tag from '@/components/tags/Tag'
import siteMetadata from '@/data/siteMetadata'
import type { Authors, Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import { ReactNode } from 'react'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

// 서버에서 조회수 가져오기
async function getViewCount(slug: string): Promise<number> {
  try {
    const response = await fetch(`/api/views/${slug}`, {
      next: { revalidate: 7200 },
    })
    if (!response.ok) return 0
    const data = await response.json()
    return data.views || 0
  } catch (error) {
    console.error('Failed to fetch view count:', error)
    return 0
  }
}

export default async function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  children,
}: LayoutProps) {
  const { filePath, path, slug, date, title, tags, summary, images, readingTime } = content
  const basePath = path.split('/')[0]

  // 서버에서 조회수 가져오기
  const viewCount = await getViewCount(slug)

  return (
    <SectionContainer>
      {/* <ViewRecorder slug={slug} /> */}
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 ">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          sizes="38px"
                          loading="eager"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        <dt className="sr-only">Github</dt>
                        <dd>
                          {author.github && (
                            <Link
                              href={author.github as string}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {author?.github?.replace('https://github.com/', '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
                <PostMetrics
                  readingTime={readingTime}
                  viewCount={viewCount}
                  className="flex xl:hidden w-full items-center justify-center gap-3 pt-6"
                />
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>

              {siteMetadata.comments && (
                <div
                  className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>
            <footer>
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                <PostMetrics
                  className="hidden xl:flex w-full items-start justify-center flex-col gap-4 py-4 px-1"
                  readingTime={readingTime}
                  viewCount={viewCount}
                />
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap mt-2">
                      {tags.map((tag) => (
                        <Tag className="pr-1 pb-1" key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="grid grid-cols-1 gap-4 py-4 xl:py-8">
                    {prev && prev.path ? (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 truncate">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}
                    {next && next.path ? (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 truncate">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                )}
              </div>
              <div className="hidden xl:block sticky top-8 z-10">
                <CustomTOC toc={content.toc!} exclude="Introduction" maxDepth={3} />
              </div>
              {/* <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div> */}
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}

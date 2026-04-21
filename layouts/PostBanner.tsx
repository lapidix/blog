import Image from '@/components/common/atoms/Image'
import Link from '@/components/common/atoms/Link'
import PageTitle from '@/components/common/atoms/PageTitle'
import SectionContainer from '@/components/common/atoms/SectionContainer'
import PostImageZoom from '@/components/posts/atoms/PostImageZoom'
import Comments from '@/components/posts/organisms/Comments'
import ScrollTopAndComment from '@/components/posts/organisms/ScrollTopAndComment'
import siteMetadata from '@/data/siteMetadata'
import type { Blog } from 'contentlayer/generated'
import Bleed from 'pliny/ui/Bleed'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import { ReactNode } from 'react'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostMinimal({ content, next, prev, children }: LayoutProps) {
  const { slug, title, images, summary } = content
  const displayImage = images && images.length > 0 ? images[0] : '/public/static/images/banner.jpeg'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <div className="space-y-1 pb-10 text-center dark:border-gray-700">
            <div className="w-full">
              <Bleed>
                <div className="aspect-[2/1] w-full relative">
                  <Image
                    src={displayImage}
                    fill
                    priority={true}
                    fetchPriority="high"
                    alt={title}
                    style={{ objectFit: 'cover' }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </Bleed>
            </div>
            <div className="pt-10 relative">
              <PageTitle>{title}</PageTitle>
            </div>
          </div>
          <PostImageZoom className="prose max-w-none py-4 dark:prose-invert">
            {children}
          </PostImageZoom>
          {siteMetadata.comments && (
            <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
              <Comments slug={slug} />
            </div>
          )}
          <footer>
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
              {prev && prev.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${prev.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Previous post: ${prev.title}`}
                  >
                    &larr; {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${next.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </SectionContainer>
  )
}

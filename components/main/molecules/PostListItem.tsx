import { ChartIcon } from '@/components/common/atoms/ChartIcon'
import Image from '@/components/common/atoms/Image'
import Link from '@/components/common/atoms/Link'
import { Authors, Blog, Retrospection } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer.js'

interface PostListItemProps {
  post: CoreContent<Blog | Retrospection> & { views?: number }
  author: Authors
  index?: number
}

const PostListItem = ({ post, author, index }: PostListItemProps) => {
  const { slug, date, title, tags, images, type, views } = post
  const href = type === 'Blog' ? `/posts/${slug}` : `/retrospections/${slug}`
  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 p-2  transition-all duration-300 hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      {/* 썸네일 */}
      <div className="relative flex-shrink-0 w-16 h-16 rounded overflow-hidden shadow-sm">
        <Image
          src={Array.isArray(images) && images[0] ? images[0] : '/static/images/banner.jpeg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* 텍스트 콘텐츠 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {typeof index === 'number' ? `${index + 1}. ${title}` : title}
        </h3>

        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {typeof views === 'number' && (
            <div className="flex items-center gap-0.5">
              <ChartIcon className="w-3 h-3" />
              <span>{views.toLocaleString()} views</span>
            </div>
          )}
          <div>{formatDate(date)}</div>
        </div>
      </div>

      {/* 화살표 아이콘 */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg
          className="w-4 h-4 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

export default PostListItem

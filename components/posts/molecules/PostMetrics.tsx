import { TranslateIcon } from '@/components/common/atoms/TranslateIcon'
import { ReadingTime } from '@/components/posts/atoms/ReadingTime'
import ViewCounter from '@/components/posts/atoms/ViewCounter'
import { ctm } from 'app/utils/style'
import Link from 'next/link'

interface PostMetricProps extends React.HTMLAttributes<HTMLDivElement> {
  readingTime: { text: string }
  viewCount: number
  translationLink?: string
  locale?: string
  translationExists?: boolean
}

export default function PostMetrics({
  readingTime,
  viewCount,
  className,
  translationLink,
  locale,
  translationExists,
  ...props
}: PostMetricProps) {
  return (
    <div className={ctm(className)} {...props}>
      <ReadingTime readingTime={readingTime} />
      <ViewCounter viewCount={viewCount} />
      {translationExists && translationLink && (
        <Link
          href={translationLink}
          className="text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center gap-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 p-1 -ml-1 active:scale-95"
        >
          <TranslateIcon className="size-4" />
          {locale === 'en' ? 'Read in Korean' : 'Read in English'}
        </Link>
      )}
    </div>
  )
}

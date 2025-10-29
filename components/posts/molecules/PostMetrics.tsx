import { ReadingTime } from '@/components/posts/atoms/ReadingTime'
import ViewCounter from '@/components/posts/atoms/ViewCounter'
import { ctm } from 'app/utils/style'

interface PostMetricProps extends React.HTMLAttributes<HTMLDivElement> {
  readingTime: { text: string }
  viewCount: number
}

export default function PostMetrics({
  readingTime,
  viewCount,
  className,
  ...props
}: PostMetricProps) {
  return (
    <div className={ctm(className)} {...props}>
      <ReadingTime readingTime={readingTime} />
      <ViewCounter viewCount={viewCount} />
    </div>
  )
}

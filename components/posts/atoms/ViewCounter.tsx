import { ChartIcon } from '@/components/common/atoms/ChartIcon'
// import { RSSIcon } from '@/components/common/atoms/RSSIcon'

export default function ViewCounter({ viewCount }: { viewCount: number }) {
  return (
    <div className="text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 flex items-center gap-2">
      <ChartIcon className="size-4" />
      <span>{viewCount.toLocaleString()} views</span>
    </div>
  )
}

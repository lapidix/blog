import { BookIcon } from '@/components/common/atoms/BookIcon'

export const ReadingTime = ({ readingTime }: { readingTime: { text: string } }) => {
  return (
    <div className="text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 flex items-center gap-2">
      <BookIcon className="size-4" />
      <span>{readingTime.text}</span>
    </div>
  )
}

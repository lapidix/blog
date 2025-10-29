'use client'

import { RSSIcon } from '@/components/common/atoms/RSSIcon'
import { useViews } from '@/hooks/useViews'
import { useEffect, useRef } from 'react'

interface ViewTrackerProps {
  slug: string
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  const { views, incrementViews, isLoading } = useViews(slug)
  const hasIncremented = useRef(false)

  useEffect(() => {
    if (!hasIncremented.current) {
      console.log(`ViewTracker: Setting up view increment for ${slug}`)
      hasIncremented.current = true

      const timer = setTimeout(() => {
        console.log(`ViewTracker: Calling incrementViews for ${slug}`)
        incrementViews()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [incrementViews, slug])

  if (isLoading) {
    return (
      <div className="text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <RSSIcon className="size-4" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 flex items-center gap-2">
      <RSSIcon className="size-4" />
      <span>{views.toLocaleString()} views</span>
    </div>
  )
}

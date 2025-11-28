'use client'

import siteMetadata from '@/data/siteMetadata'
import { Comments as CommentsComponent } from 'pliny/comments'
import { useEffect, useRef, useState } from 'react'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoadComments(true)

    const container = containerRef.current

    return () => {
      if (container) {
        const iframes = container.querySelectorAll('iframe')
        iframes.forEach((iframe) => {
          try {
            iframe.src = 'about:blank'
          } catch (error) {
            const isExpectedError = error instanceof DOMException && error.name === 'SecurityError'

            if (!isExpectedError) {
              console.error('[Comments] Unexpected iframe cleanup error:', error)
            }
          }
        })
      }
    }
  }, [])

  return (
    <div ref={containerRef} suppressHydrationWarning>
      {siteMetadata.comments && loadComments && (
        <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
      )}
    </div>
  )
}

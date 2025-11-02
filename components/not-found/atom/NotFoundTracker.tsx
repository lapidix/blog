'use client'

import * as Sentry from '@sentry/nextjs'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export const NotFoundTracker = () => {
  const pathname = usePathname()

  useEffect(() => {
    Sentry.captureException(new Error('404 Page Not Found'), {
      tags: {
        error_type: '404',
        page_type: 'not_found',
      },
      contexts: {
        page: {
          path: pathname,
          type: '404',
        },
      },
      level: 'warning',
    })
  }, [pathname])

  return null
}

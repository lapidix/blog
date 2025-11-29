// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

console.log('Sentry Client Init:', {
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN ? 'SET' : 'NOT SET',
  environment: process.env.NODE_ENV,
})

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  environment: process.env.NODE_ENV,

  // Protected Privacy
  sendDefaultPii: false,

  release: process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Client Event:', event)
    }
    // Bot filtering
    const userAgent = event.request?.headers?.['User-Agent'] || ''
    if (/bot|crawler|spider/i.test(userAgent)) {
      return null
    }

    return event
  },
})

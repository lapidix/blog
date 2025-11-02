// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

console.log('Sentry Client Init:', {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ? 'SET' : 'NOT SET',
  environment: process.env.NODE_ENV,
})

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 클라이언트 성능 추적 샘플링 (프로덕션에서 낮게)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 환경 구분
  environment: process.env.NODE_ENV,

  // 개인정보 보호
  sendDefaultPii: false,

  // 릴리즈 버전
  release: process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // 클라이언트 에러 필터링
  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Client Event:', event)
    }
    return event
  },

  // 성능 모니터링은 자동으로 활성화됨 (tracesSampleRate > 0일 때)
})

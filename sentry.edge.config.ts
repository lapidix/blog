// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

console.log('Sentry Edge Init:', {
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN ? 'SET' : 'NOT SET',
  environment: process.env.NODE_ENV,
})

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 성능 추적 샘플링
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 환경 구분
  environment: process.env.NODE_ENV,

  // 개인정보 보호
  sendDefaultPii: false,

  // 릴리즈 버전
  release: process.env.SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA,
})

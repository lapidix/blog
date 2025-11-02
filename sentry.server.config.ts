// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

console.log('Sentry Server Init:', {
  dsn: process.env.SENTRY_DSN ? 'SET' : 'NOT SET',
  environment: process.env.NODE_ENV,
})

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // 프로덕션에서는 샘플링 비율을 낮게 설정 (비용 절약)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 환경 구분
  environment: process.env.NODE_ENV,

  // 개인정보 보호를 위해 기본적으로 비활성화
  sendDefaultPii: false,

  // 릴리스 버전 설정 (우선순위: 수동 설정 > Vercel 커밋 해시 > package.jso
  release: process.env.SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA,

  // 에러 필터링 (불필요한 에러 제외)
  beforeSend(event) {
    // 개발 환경에서도 콘솔에 출력하지만 Sentry로도 전송
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Server Event:', event)
    }
    return event
  },
})

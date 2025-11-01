import * as Sentry from '@sentry/nextjs'

/**
 * 수동으로 에러를 Sentry에 전송
 */
export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    tags: {
      section: 'blog',
    },
    extra: context,
  })
}

/**
 * 사용자 정의 메시지 전송
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level)
}

/**
 * 사용자 컨텍스트 설정
 */
export function setUserContext(user: { id?: string; email?: string; username?: string }) {
  Sentry.setUser(user)
}

/**
 * 커스텀 태그 설정
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value)
}

/**
 * 성능 추적을 위한 스팬 생성 (Sentry v8 방식)
 */
export function withSentrySpan<T>(name: string, op: string, fn: () => T): T {
  return Sentry.withActiveSpan(null, () => {
    return Sentry.startSpan({ name, op }, fn)
  })
}

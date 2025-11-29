'use client'

import { setUserContext } from '@/libs/sentry-utils'
import { useEffect } from 'react'

export const SentryIdentifier = () => {
  useEffect(() => {
    // 브라우저에서만 실행
    if (typeof window === 'undefined') return

    try {
      // localStorage에서 기존 ID 확인
      let userId = localStorage.getItem('sentry_user_id')

      // 없으면 새로 생성
      if (!userId) {
        userId = crypto.randomUUID()
        localStorage.setItem('sentry_user_id', userId)
      }

      // Sentry에 사용자 정보 설정
      setUserContext({ id: userId })

      if (process.env.NODE_ENV === 'development') {
        console.log('[Sentry] User ID set:', userId)
      }
    } catch (error) {
      console.error('[Sentry] Failed to set user context:', error)
    }
  }, [])

  return null
}

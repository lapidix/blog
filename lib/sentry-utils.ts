import * as Sentry from '@sentry/nextjs'
import { PostNotFoundError } from 'errors/post.error'
import { headers } from 'next/headers'

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

export function capturePostNotFound(
  slug: string,
  pageType: 'blog_post' | 'reflection_post',
  location?: string
) {
  const headersList = headers()
  const referer = headersList.get('referer') || 'direct'

  const error = new PostNotFoundError(slug, referer, pageType)

  Sentry.captureException(error, {
    fingerprint: ['post-not-found', pageType === 'blog_post' ? 'blog' : 'reflection'],
    tags: {
      error_type: 'post_not_found',
      page_type: pageType,
      ...(location && { location }),
    },
    contexts: {
      post: {
        slug: error.slug,
        path: `/${pageType === 'blog_post' ? 'posts' : 'reflections'}/${slug}`,
        referer: error.referer,
      },
    },
    level: 'warning',
  })
}

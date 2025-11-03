import * as Sentry from '@sentry/nextjs'
import { PostNotFoundError } from 'errors/post.error'

export function captureKVError(
  error: Error,
  action: 'increment_views' | 'get_view_count' | 'get_trending_posts',
  context?: Record<string, unknown>
) {
  Sentry.captureException(error, {
    fingerprint: ['vercel-kv-error', action],
    tags: {
      error_type: 'vercel_kv',
      action,
    },
    contexts: {
      kv: context || {},
    },
    level: 'error',
  })
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    tags: {
      section: 'blog',
    },
    extra: context,
  })
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level)
}

export function setUserContext(user: { id?: string; email?: string; username?: string }) {
  Sentry.setUser(user)
}

export async function capturePostNotFound(
  slug: string,
  pageType: 'blog_post' | 'reflection_post',
  location?: string
) {
  // referer 가져오기 (빌드 타임에는 사용 불가)
  let referer = 'build-time'
  try {
    const { headers } = await import('next/headers')
    const headersList = headers()
    referer = headersList.get('referer') || 'direct'
  } catch (error) {
    // 빌드 타임이나 정적 생성 시에는 headers() 사용 불가
    console.warn('[Sentry] headers() not available, using build-time referer')
  }

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
    level: 'error',
  })
}

import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/posts/')) {
    const pathname = request.nextUrl.pathname

    if (pathname.includes('/page/')) {
      return NextResponse.next()
    }

    const slug = pathname.split('/').pop()

    if (slug && slug !== 'posts') {
      // 쿠키로 이미 카운트했는지 확인
      const viewedKey = `viewed_${slug}`
      const hasViewed = request.cookies.get(viewedKey)

      if (!hasViewed) {
        console.log(`Middleware: Incrementing views for ${slug}`)

        // 직접 KV에서 조회수 증가
        console.log(`Incrementing views directly in KV for: ${slug}`)

        try {
          const { kv } = await import('@vercel/kv')

          // 1. 개별 조회수 증가
          const views = await kv.incr(`views:${slug}`)
          console.log(`New view count for ${slug}: ${views}`)

          // 2. Sorted Set에 조회수 업데이트 (score가 조회수)
          await kv.zadd('trending:posts', { score: views, member: slug })
          console.log(`Updated trending posts for ${slug}`)
        } catch (error) {
          console.error('Middleware: Failed to increment views in KV:', error)

          // Sentry에 에러 전송
          const { captureError } = await import('./lib/sentry-utils')
          captureError(error as Error, {
            slug,
            action: 'increment_views',
            location: 'middleware',
          })
        }

        const response = NextResponse.next()
        response.cookies.set(viewedKey, 'true', {
          maxAge: 60 * 60, // 1시간
          httpOnly: true,
          sameSite: 'lax',
        })
        return response
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/posts/((?!page/).+)', // 포스트 페이지만, 페이지네이션 제외
  ],
}

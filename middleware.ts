import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // 포스트 페이지 방문 시 조회수 증가
  if (request.nextUrl.pathname.startsWith('/posts/')) {
    const slug = request.nextUrl.pathname.split('/').pop()

    if (slug) {
      // 쿠키로 이미 카운트했는지 확인
      const viewedKey = `viewed_${slug}`
      const hasViewed = request.cookies.get(viewedKey)

      if (!hasViewed) {
        console.log(`Middleware: Incrementing views for ${slug}`)

        // 백그라운드에서 조회수 증가
        fetch(`${request.nextUrl.origin}/api/views/${slug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch((error) => {
          console.error('Middleware: Failed to increment views:', error)
        })

        // 쿠키 설정 (1시간 유효)
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
  matcher: '/posts/:path*', // 포스트 페이지만 정확히 매칭
}

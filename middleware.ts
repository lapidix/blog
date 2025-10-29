import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // 포스트 페이지 방문 시 조회수 증가
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

        const apiUrl = `${request.nextUrl.origin}/api/views/${slug}`
        console.log(`Attempting to fetch: ${apiUrl}`)

        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Middleware/1.0',
          },
        })
          .then((response) => {
            console.log(`API response status: ${response.status}`)
            if (!response.ok) {
              console.error(`API error: ${response.status} ${response.statusText}`)
            }
          })
          .catch((error) => {
            console.error('Middleware: Failed to increment views:', error)
          })

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

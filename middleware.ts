import { NextRequest, NextResponse } from 'next/server'

// 조회수 카운트에서 제외할 파일 확장자
const EXCLUDED_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.ico',
  '.zip',
  '.pdf',
  '.mp4',
  '.mp3',
  '.json',
  '.xml',
  '.txt',
  '.js',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 파일 확장자가 있으면 스킵
  if (EXCLUDED_EXTENSIONS.some((ext) => pathname.toLowerCase().endsWith(ext))) {
    return NextResponse.next()
  }

  // /page/ 경로 스킵 (페이지네이션)
  if (pathname.includes('/page/')) {
    return NextResponse.next()
  }

  // posts 또는 retrospections 경로 처리
  const isPost = pathname.startsWith('/posts/') || pathname.startsWith('/en/posts/')
  const isRetrospection =
    pathname.startsWith('/retrospections/') || pathname.startsWith('/en/retrospections/')

  if (isPost || isRetrospection) {
    // /en/posts/slug 의 경우에도 기본 slug만 추출하여 한국어 글과 조회수를 합산
    const slug = pathname.replace(/^\/(en\/)?(posts|retrospections)\//, '')

    // _next/data 등의 내부 요청은 조회수 집계에서 제외
    if (pathname.includes('/_next/')) {
      return NextResponse.next()
    }
    const viewedKey = `viewed_${slug.replace(/\//g, '_')}` // 쿠키 키에 / 가 들어가지 않도록 치환
    const hasViewed = request.cookies.get(viewedKey)

    if (!hasViewed) {
      incrementViews(slug).catch((error) => {
        console.error('[Middleware] View increment failed:', error)
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

  return NextResponse.next()
}

async function incrementViews(slug: string) {
  try {
    const { kv } = await import('@vercel/kv')

    const views = await kv.incr(`views:${slug}`)
    await kv.zadd('trending:posts', { score: views, member: slug })

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Middleware] Views for ${slug}: ${views}`)
    }
  } catch (error) {
    const { captureKVError } = await import('./lib/sentry-utils')
    captureKVError(error as Error, 'increment_views', {
      slug,
      location: 'middleware',
    })
    throw error
  }
}

export const config = {
  matcher: [
    '/posts/:path*',
    '/en/posts/:path*',
    '/retrospections/:path*',
    '/en/retrospections/:path*',
  ],
}

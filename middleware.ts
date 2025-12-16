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
  const isPost = pathname.startsWith('/posts/')
  const isRetrospection = pathname.startsWith('/retrospections/')

  if (isPost || isRetrospection) {
    const slug = pathname.replace(/^\/(posts|retrospections)\//, '')
    const viewedKey = `viewed_${slug}`
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
  matcher: ['/posts/:path*', '/retrospections/:path*'],
}

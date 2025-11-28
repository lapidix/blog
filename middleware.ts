import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/posts/')) {
    if (pathname.includes('/page/')) {
      return NextResponse.next()
    }

    const slug = pathname.replace('/posts/', '')
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
  matcher: ['/posts/((?!page/).+)'],
}

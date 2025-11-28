import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/posts/')) {
    const pathname = request.nextUrl.pathname

    if (pathname.includes('/page/')) {
      return NextResponse.next()
    }

    const slug = pathname.split('/').pop()

    if (slug && slug !== 'posts') {
      const viewedKey = `viewed_${slug}`
      const hasViewed = request.cookies.get(viewedKey)

      if (!hasViewed) {
        console.log(`Middleware: Incrementing views for ${slug}`)
        console.log(`Incrementing views directly in KV for: ${slug}`)

        try {
          const { kv } = await import('@vercel/kv')

          const views = await kv.incr(`views:${slug}`)
          console.log(`New view count for ${slug}: ${views}`)

          await kv.zadd('trending:posts', { score: views, member: slug })
          console.log(`Updated trending posts for ${slug}`)
        } catch (error) {
          console.error('Middleware: Failed to increment views in KV:', error)

          const { captureKVError } = await import('./lib/sentry-utils')
          captureKVError(error as Error, 'increment_views', {
            slug,
            location: 'middleware',
          })
        }

        const response = NextResponse.next()
        response.cookies.set(viewedKey, 'true', {
          maxAge: 60 * 60,
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
  matcher: ['/posts/((?!page/).+)'],
}

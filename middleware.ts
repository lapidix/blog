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

// Accept 협상으로 마크다운을 돌려줄 수 있는 문서 경로
const MARKDOWN_PATH_PREFIXES = ['/posts/', '/en/posts/', '/retrospections/', '/en/retrospections/']

/** Accept 헤더에서 주어진 MIME 타입의 q 값을 뽑는다. 없으면 0. */
function qualityOf(accept: string, type: string): number {
  for (const part of accept.split(',')) {
    const [mime, ...params] = part.trim().split(';')
    if (mime.trim().toLowerCase() !== type) continue
    const q = params.map((param) => param.trim()).find((param) => param.startsWith('q='))
    if (!q) return 1
    const parsed = Number.parseFloat(q.slice(2))
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return 0
}

/**
 * text/markdown 을 text/html 이상으로 선호하는 요청인지 판단한다.
 * 브라우저의 Accept 에는 text/markdown 이 없으므로 항상 false 가 된다.
 */
function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false
  const markdown = qualityOf(accept, 'text/markdown')
  if (markdown === 0) return false
  return markdown >= qualityOf(accept, 'text/html')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 문서 경로에 한해 마크다운 협상을 먼저 처리한다.
  const isDocumentPath =
    MARKDOWN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix)) &&
    !pathname.includes('/page/') &&
    !pathname.includes('/_next/')

  if (isDocumentPath) {
    const hasMarkdownExtension = pathname.endsWith('.md')

    if (hasMarkdownExtension || prefersMarkdown(request.headers.get('accept'))) {
      const documentPath = (
        hasMarkdownExtension ? pathname.slice(0, -'.md'.length) : pathname
      ).replace(/\/+$/, '')
      // Vary 는 rewrite 대상인 app/md/[...slug]/route.ts 응답에서 직접 붙인다.
      // 여기서 set 해도 Next 가 최종 응답 단계에서 덮어쓴다.
      return NextResponse.rewrite(new URL(`/md${documentPath}`, request.url))
    }
  }

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

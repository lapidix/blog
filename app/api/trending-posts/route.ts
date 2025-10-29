import { kv } from '@vercel/kv'
import { allBlogs, Blog } from 'contentlayer/generated'
import { NextResponse } from 'next/server'
import { allCoreContent, CoreContent, sortPosts } from 'pliny/utils/contentlayer.js'

// API 라우트에 캐싱 설정 추가 (2시간)
export const revalidate = 7200

interface PostWithViews extends CoreContent<Blog> {
  views: number
}

export async function GET() {
  try {
    // Sorted Set에서 상위 4개 포스트 가져오기 (높은 점수부터)
    const trendingSlugs = await kv.zrange('trending:posts', 0, 4, {
      rev: true,
      withScores: true,
    })

    // 모든 포스트 데이터
    const posts = allCoreContent(sortPosts(allBlogs))
    const trendingPosts: PostWithViews[] = []

    // trendingSlugs가 있을 경우에만 처리
    if (trendingSlugs && trendingSlugs.length > 0) {
      for (let i = 0; i < trendingSlugs.length; i += 2) {
        const slug = trendingSlugs[i] as string
        const views = trendingSlugs[i + 1] as number

        const post = posts.find((p) => p.slug === slug)
        if (post) {
          trendingPosts.push({
            ...post,
            views: views,
          })
        }
      }
    }

    return NextResponse.json(trendingPosts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get trending posts' }, { status: 500 })
  }
}

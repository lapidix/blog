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
  // 캐싱 설정이 적용된 API 라우트
  try {
    console.log('Fetching trending posts from KV store...')

    // Sorted Set에서 상위 4개 포스트 가져오기 (높은 점수부터)
    const trendingSlugs = await kv.zrange('trending:posts', 0, 4, {
      rev: true,
      withScores: true,
    })

    console.log('Trending slugs from KV:', trendingSlugs)

    // 모든 포스트 데이터
    const posts = allCoreContent(sortPosts(allBlogs))

    if (!trendingSlugs || trendingSlugs.length === 0) {
      console.log('No trending posts found, returning latest posts')
      // 트렌딩 포스트가 없으면 최신 4개 포스트 반환
      const latestPosts = posts.slice(0, 4).map((post) => ({
        ...post,
        views: 0,
      }))
      console.log('Returning latest posts:', latestPosts.length)
      return NextResponse.json(latestPosts)
    }

    // 인기 포스트 데이터 매핑
    const trendingPosts: PostWithViews[] = []

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

    // 4개 미만이면 일반 포스트로 채우기
    if (trendingPosts.length < 4) {
      const usedSlugs = new Set(trendingPosts.map((p) => p.slug))
      const remainingPosts = posts
        .filter((post) => !usedSlugs.has(post.slug))
        .slice(0, 4 - trendingPosts.length)
        .map((post) => ({
          ...post,
          views: 0,
        }))

      trendingPosts.push(...remainingPosts)
    }

    return NextResponse.json(trendingPosts)
  } catch (error) {
    console.error('Error getting popular posts:', error)

    // Fallback: 기존 방식으로 조회
    try {
      const posts = allCoreContent(sortPosts(allBlogs))
      const postsWithViews = await Promise.all(
        posts.map(async (post) => {
          const views = (await kv.get(`views:${post.slug}`)) || 0
          return {
            ...post,
            views: Number(views),
          }
        })
      )

      const trendingPosts: PostWithViews[] = postsWithViews
        .filter((post) => post.views > 0)
        .sort((a, b) => b.views - a.views)
        .slice(0, 4)

      return NextResponse.json(trendingPosts)
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError)
      return NextResponse.json({ error: 'Failed to get popular posts' }, { status: 500 })
    }
  }
}

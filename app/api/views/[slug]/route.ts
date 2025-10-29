import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  console.log(`POST /api/views/${params.slug} - Starting request`)

  try {
    const { slug } = params

    console.log(`Incrementing views for slug: ${slug}`)
    console.log('KV connection status:', !!kv)

    // 1. 개별 조회수 증가
    const views = await kv.incr(`views:${slug}`)
    console.log(`New view count for ${slug}: ${views}`)

    // 2. Sorted Set에 조회수 업데이트 (score가 조회수)
    await kv.zadd('trending:posts', { score: views, member: slug })
    console.log(`Updated trending posts for ${slug}`)

    return NextResponse.json({ views })
  } catch (error) {
    console.error('Error incrementing views:', error)
    console.error('Error details:', error)
    return NextResponse.json(
      { error: 'Failed to increment views', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // 현재 조회수 조회
    const views = (await kv.get(`views:${slug}`)) || 0

    return NextResponse.json({ views })
  } catch (error) {
    console.error('Error getting views:', error)
    return NextResponse.json({ error: 'Failed to get views' }, { status: 500 })
  }
}

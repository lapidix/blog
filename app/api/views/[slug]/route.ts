import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // 1. 개별 조회수 증가
    const views = await kv.incr(`views:${slug}`)

    // 2. Sorted Set에 조회수 업데이트 (score가 조회수)
    await kv.zadd('trending:posts', { score: views, member: slug })

    return NextResponse.json({ views })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to increment views', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const views = (await kv.get(`views:${slug}`)) || 0

    return NextResponse.json({ views })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get views' }, { status: 500 })
  }
}

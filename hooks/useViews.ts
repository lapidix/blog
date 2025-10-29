'use client'

import { useEffect, useState } from 'react'

export function useViews(slug: string) {
  const [views, setViews] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  // 조회수 가져오기 함수
  const fetchViews = async () => {
    try {
      const response = await fetch(`/api/views/${slug}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setViews(data.views)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching views:', error)
      setIsLoading(false)
    }
  }

  // 조회수 증가 (전역적으로 중복 호출 방지)
  const incrementViews = async () => {
    try {
      console.log(`useViews: Calling increment API for ${slug}`)
      const response = await fetch(`/api/views/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(`useViews: Received new view count for ${slug}:`, data.views)
      setViews(data.views)
    } catch (error) {
      console.error('Error incrementing views:', error)
    }
  }

  // 컴포넌트 마운트 시 조회수 가져오기
  useEffect(() => {
    fetchViews()
  }, [slug])

  return { views, incrementViews, isLoading }
}

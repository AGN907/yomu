'use client'

import { fetchSourceNovelsAction } from '@/actions/sources'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'

type NovelsQueryOptions = {
  sourceId: string
  initialIsLatest: boolean
  initialQuery: string
}

const STALETIME_IN_MILLISECONDS = 1000 * 60 * 10 // 10 Minutes

export function useNovelsInfiniteQuery(options: NovelsQueryOptions) {
  const { sourceId, initialIsLatest = true, initialQuery } = options

  const [isLatest, setIsLatest] = useState(initialIsLatest)
  const [query, setQuery] = useState(initialQuery)

  const {
    data,
    isPending,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['novels', sourceId, isLatest, query],
    queryFn: async ({ pageParam }) => {
      const [data] = await fetchSourceNovelsAction({
        sourceId,
        page: pageParam,
        isLatest,
        query,
      })

      return {
        novels: data?.novels || [],
        hasNextPage: data?.hasNextPage || false,
      }
    },
    getNextPageParam: (lastPage, _, currentPage) =>
      lastPage?.hasNextPage ? currentPage + 1 : undefined,
    initialPageParam: 1,
    staleTime: STALETIME_IN_MILLISECONDS,
    refetchOnWindowFocus: false,
    retry: 3,
  })

  return {
    data,
    isPending,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    setIsLatest,
    setQuery,
  }
}

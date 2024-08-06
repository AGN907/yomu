'use client'

import { fetchNovelsByFilter, fetchNovelsByQuery } from '@/actions/novels'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'

type NovelsQueryOptions = {
  sourceId: string
  initialIsLatest: boolean
  initialQuery: string
}

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
      const { data } = query
        ? await fetchNovelsByQuery({ sourceId, page: pageParam, query })
        : await fetchNovelsByFilter({
            sourceId,
            page: pageParam,
            latest: isLatest,
          })

      return {
        novels: data?.novels || [],
        hasNextPage: data?.hasNextPage || false,
      }
    },
    getNextPageParam: (lastPage, _, currentPage) =>
      lastPage?.hasNextPage ? currentPage + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
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

'use client'

import { NovelCard } from '@/components/novel-card'
import { fetchNovelsByFilter, fetchNovelsByQuery } from '@/lib/actions/novels'

import type { NovelItem } from '@yomu/sources/types'

import { useInfiniteQuery } from '@tanstack/react-query'
import { LoadMore } from './load-more'

type NovelInfiniteListProps = {
  initialNovels: NovelItem[]
  sourceId: string
  isLatest: boolean
  query: string
}

function NovelInfiniteList({
  initialNovels,
  sourceId,
  isLatest,
  query,
}: NovelInfiniteListProps) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useNovelsInfiniteQuery({ sourceId, isLatest, query, initialNovels })

  const flattenedNovels = data?.pages.flatMap((page) => page.novels)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid grid-cols-1 gap-y-8 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {flattenedNovels.map((novel) => (
          <NovelCard
            key={novel.title}
            title={novel.title}
            thumbnail={novel.thumbnail}
            query={{ novelUrl: novel.url, sourceId }}
          />
        ))}
      </div>
      {hasNextPage ? (
        <LoadMore
          onIntersection={() => !isFetchingNextPage && fetchNextPage()}
        />
      ) : null}
    </div>
  )
}

type NovelsQueryOptions = {
  sourceId: string
  isLatest: boolean
  query: string
  initialNovels: NovelItem[]
}

function useNovelsInfiniteQuery(options: NovelsQueryOptions) {
  const { sourceId, isLatest = true, query, initialNovels } = options

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['novels', sourceId, isLatest, query],
      queryFn: ({ pageParam }) =>
        query
          ? fetchNovelsByQuery(sourceId, pageParam, query)
          : fetchNovelsByFilter(sourceId, pageParam, isLatest),
      getNextPageParam: (lastPage, _, currentPage) =>
        lastPage.hasNextPage ? currentPage + 1 : undefined,
      initialPageParam: 2,
      initialData: {
        pages: [{ novels: initialNovels, hasNextPage: true }],
        pageParams: [1],
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    })

  return {
    data,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  }
}

export { NovelInfiniteList }

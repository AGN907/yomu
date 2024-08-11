'use client'

import { NovelCard } from '@/components/novel-card'
import Spinner from '@/components/spinner'
import { getNovelInfo } from '@/lib/actions/novels'
import { FiltersToggle } from './_components/filters-toggle'
import { LoadMore } from './_components/load-more'
import { SearchSourceForm } from './_components/search-source-form'
import { useNovelsInfiniteQuery } from './_components/use-novels-infinite-query'

import { useAction } from 'next-safe-action/hooks'

type BrowseSourceProps = {
  query: string
  isLatest: boolean
  sourceId: string
}

function BrowseSource({ query, isLatest, sourceId }: BrowseSourceProps) {
  const {
    data,
    isFetchingNextPage,
    isPending,
    hasNextPage,
    fetchNextPage,
    setQuery,
    setIsLatest,
  } = useNovelsInfiniteQuery({
    sourceId,
    initialIsLatest: isLatest,
    initialQuery: query,
  })

  const flattenedNovels = data?.pages.flatMap((page) => page.novels) || []

  const { execute } = useAction(getNovelInfo)

  return (
    <div>
      <div className="flex justify-between">
        <div className="relative w-full max-w-md">
          <SearchSourceForm onSearchSubmit={setQuery} />
        </div>
        <div>
          <FiltersToggle
            onFilterChange={(filter) => setIsLatest(filter === 'latest')}
          />
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl pt-8">
        <div className="mx-auto max-w-4xl">
          {isPending ? (
            <Spinner size={48} />
          ) : (
            <div className="grid grid-cols-1 gap-y-8 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {flattenedNovels.map((novel) => (
                <NovelCard
                  key={novel.title}
                  title={novel.title}
                  thumbnail={novel.thumbnail}
                  onNovelClick={() => execute({ sourceId, url: novel.url })}
                />
              ))}
            </div>
          )}
          {hasNextPage ? (
            <LoadMore
              onIntersection={() => !isFetchingNextPage && fetchNextPage()}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export { BrowseSource }

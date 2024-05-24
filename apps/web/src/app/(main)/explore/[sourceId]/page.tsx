import { fetchNovelsByFilter, fetchNovelsByQuery } from '@/lib/actions/novels'
import { FiltersToggle } from './_components/filters-toggle'
import { NovelInfiniteList } from './_components/novel-infinite-list'

import { Button } from '@yomu/ui/components/button'
import { Search } from '@yomu/ui/components/icons'
import { Input } from '@yomu/ui/components/input'

type SourcePageProps = {
  params: {
    sourceId: string
  }
  searchParams: {
    filter?: string
    q: string
  }
}

export function generateMetadata({ params }: SourcePageProps) {
  const { sourceId } = params
  const sourceTitle = sourceId
    .split('')
    .map((s) => (s.toUpperCase() === s ? ` ${s}` : s))
    .join('')

  return {
    title: `${sourceTitle} - Yomu`,
  }
}

async function SourcePage({ params, searchParams }: SourcePageProps) {
  const { sourceId } = params
  const { filter, q } = searchParams
  const isLatest = (filter || 'latest') === 'latest'

  const { novels } = q
    ? await fetchNovelsByQuery(sourceId, 1, q)
    : await fetchNovelsByFilter(sourceId, 1, isLatest)

  return (
    <div className="container space-y-4">
      <h1 className="text-2xl font-semibold md:text-3xl">{sourceId}</h1>
      <div className="flex justify-between">
        <div className="relative w-full max-w-md">
          <form>
            <Input
              defaultValue={q}
              name="q"
              className="pr-10"
              placeholder="Search novels..."
            />
            <Button
              className="absolute right-2 top-1/2 -translate-y-1/2"
              size="icon"
              variant="ghost"
            >
              <Search className="size-5" />
            </Button>
          </form>
        </div>
        <div>
          <FiltersToggle />
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl pt-8">
        <NovelInfiniteList
          initialNovels={novels}
          sourceId={sourceId}
          isLatest={isLatest}
          query={q}
        />
      </div>
    </div>
  )
}

export default SourcePage

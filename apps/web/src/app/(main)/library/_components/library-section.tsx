'use client'

import Spinner from '@/components/spinner'
import { LibraryCategories } from './library-categories'
import { LibraryList } from './library-list'
import { UpdateCategoryNovels } from './update-category-novels'
import { useLibraryQuery } from './use-library-query'

import { Category } from '@yomu/core/database/schema/web'
import { ScrollArea, ScrollBar } from '@yomu/ui/components/scroll-area'

type LibrarySectionProps = {
  initialCategoryId: number
  initialCategories: Category[]
}

function LibrarySection(props: LibrarySectionProps) {
  const { initialCategoryId, initialCategories } = props

  const { data, isLoading, isFetching, categoryId, setCategoryId } =
    useLibraryQuery(initialCategoryId)

  return (
    <>
      <div className="flex flex-row-reverse items-center gap-2 whitespace-nowrap md:flex-row">
        <UpdateCategoryNovels categoryId={categoryId} />
        <ScrollArea>
          <div className="py-4">
            <LibraryCategories
              categories={initialCategories}
              setCategoryId={setCategoryId}
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {isLoading || isFetching ? <Spinner size={40} /> : null}
      <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 md:place-items-start lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {}
        {data ? <LibraryList novels={data} /> : null}
      </div>
    </>
  )
}

export { LibrarySection }

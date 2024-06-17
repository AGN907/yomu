'use client'

import Spinner from '@/components/spinner'
import { LibraryCategories } from './library-categories'
import { LibraryList } from './library-list'
import { UpdateCategoryNovels } from './update-category-novels'
import { useLibraryQuery } from './use-library-query'

import { Category } from '@yomu/core/database/schema/web'
import { ScrollArea, ScrollBar } from '@yomu/ui/components/scroll-area'

type LibrarySectionProps = {
  initialCategories: Category[]
}

function LibrarySection(props: LibrarySectionProps) {
  const { initialCategories } = props

  const defaultCategoryId = 1

  const {
    data = [],
    isLoading,
    isFetching,
    categoryId,
    setCategoryId,
  } = useLibraryQuery(defaultCategoryId)

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
      {}
      {data.length > 0 ? (
        <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 md:place-items-start lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
          <LibraryList novels={data} />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-xl font-medium">Category is empty</h3>
        </div>
      )}
    </>
  )
}

export { LibrarySection }

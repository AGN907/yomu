'use client'

import Spinner from '@/components/spinner'
import { LibraryCategories } from './library-categories'
import { LibraryList } from './library-list'
import { UpdateCategoryNovels } from './update-category-novels'
import { useLibraryQuery } from './use-library-query'

import { Category } from '@yomu/core/database/schema/web'
import { ScrollArea, ScrollBar } from '@yomu/ui/components/scroll-area'

import { useSearchParams } from 'next/navigation'

type LibrarySectionProps = {
  initialCategories: Category[]
}

function LibrarySection(props: LibrarySectionProps) {
  const { initialCategories } = props

  const searchParams = useSearchParams()
  const category = searchParams.get('categoryId')

  const defaultCategory = initialCategories.find((c) => c.default) as Category
  const defaultCategoryId = Number(category) || defaultCategory.id

  const {
    data = [],
    isLoading,
    isFetching,
    categoryId,
    setCategoryId,
  } = useLibraryQuery(defaultCategoryId)

  const isPending = isLoading || isFetching

  return (
    <>
      <div className="flex flex-row-reverse items-center gap-2 whitespace-nowrap md:flex-row">
        <UpdateCategoryNovels categoryId={categoryId} />
        <ScrollArea>
          <div className="py-4">
            <LibraryCategories
              categories={initialCategories}
              defaultCategoryId={defaultCategoryId}
              selectedCategoryId={categoryId}
              setCategoryId={setCategoryId}
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {isPending ? <Spinner size={40} /> : null}
      {!isPending && data.length === 0 ? (
        <div className="flex items-center justify-center">
          <h3 className="text-xl font-medium">Category is empty</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 md:place-items-start lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
          <LibraryList novels={data} />
        </div>
      )}
    </>
  )
}

export { LibrarySection }

'use client'

import Spinner from '@/components/spinner'
import { LibraryCategories } from './library-categories'
import { LibraryList } from './library-list'
import { useLibraryQuery } from './use-library-query'

import { Category } from '@yomu/core/database/schema/web'

type LibrarySectionProps = {
  initialCategoryId: number
  initialCategories: Category[]
}

function LibrarySection(props: LibrarySectionProps) {
  const { initialCategoryId, initialCategories } = props

  const { data, isLoading, isFetching, setCategoryId } =
    useLibraryQuery(initialCategoryId)

  return (
    <>
      <div className="self-start">
        <LibraryCategories
          categories={initialCategories}
          setCategoryId={setCategoryId}
        />
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

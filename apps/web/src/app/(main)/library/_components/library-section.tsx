'use client'

import Spinner from '@/components/spinner'
import { getNovelsByCategory } from '@/lib/actions/novels'
import { LibraryList } from './library-list'
import { UpdateCategoryNovels } from './update-category-novels'

import { Category } from '@yomu/core/database/schema/web'
import { capitalize } from '@yomu/core/utils/string'
import { ScrollArea, ScrollBar } from '@yomu/ui/components/scroll-area'
import { ToggleGroup, ToggleGroupItem } from '@yomu/ui/components/toggle-group'

import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

type LibrarySectionProps = {
  initialCategories: Category[]
}

function LibrarySection(props: LibrarySectionProps) {
  const { initialCategories } = props
  const {
    execute: getNovels,
    status: getNovelsStatus,
    result: { data = [] },
  } = useAction(getNovelsByCategory)

  const searchParams = useSearchParams()
  const category = searchParams.get('categoryId')

  const defaultCategory = initialCategories.find((c) => c.default) as Category
  const defaultCategoryId = Number(category) || defaultCategory.id

  useEffect(() => {
    getNovels({ categoryId: defaultCategoryId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isPending =
    getNovelsStatus === 'executing' || getNovelsStatus === 'idle'

  return (
    <>
      <div className="flex flex-row-reverse items-center gap-2 whitespace-nowrap md:flex-row">
        <UpdateCategoryNovels categoryId={defaultCategoryId} />
        <ScrollArea>
          <div className="py-4">
            <ToggleGroup
              variant="outline"
              size="sm"
              type="single"
              defaultValue={`${defaultCategoryId}`}
              onValueChange={(value) =>
                value && getNovels({ categoryId: Number(value) })
              }
            >
              {initialCategories.map((category) => (
                <ToggleGroupItem
                  key={category.id}
                  value={`${category.id}`}
                  aria-checked={defaultCategoryId === category.id}
                  data-state={defaultCategoryId === category.id ? 'on' : 'off'}
                  asChild
                >
                  <Link href={{ query: { categoryId: category.id } }}>
                    {capitalize(category.name)}
                  </Link>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {isPending ? <Spinner size={40} /> : null}
      {!isPending && data?.length === 0 ? (
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

'use client'

import Spinner from '@/components/spinner'
import { LibraryList } from './library-list'
import { useLibraryNovels } from './use-library-novels'
import type { UserSession } from '@/lib/safe-action'

import type { Category } from '@yomu/core/database/schema/web'
import { capitalize } from '@yomu/core/utils/string'
import { ScrollArea, ScrollBar } from '@yomu/ui/components/scroll-area'
import { ToggleGroup, ToggleGroupItem } from '@yomu/ui/components/toggle-group'

import Link from 'next/link'

type LibrarySectionProps = {
  user: UserSession
  initialCategories: Category[]
  initialCategoryId?: number
}

function LibrarySection(props: LibrarySectionProps) {
  const { user, initialCategories, initialCategoryId } = props

  const defaultCategory = initialCategories.find((c) => c.default) as Category
  const defaultCategoryId = initialCategoryId || defaultCategory.id

  const { data, isPending, setSelectedCategory } = useLibraryNovels({
    user,
    categoryId: defaultCategoryId,
  })

  return (
    <>
      <div className="flex flex-row-reverse items-center gap-2 whitespace-nowrap md:flex-row">
        <ScrollArea>
          <div className="py-4">
            <ToggleGroup
              variant="outline"
              size="sm"
              type="single"
              defaultValue={`${defaultCategoryId}`}
              onValueChange={(value) =>
                value && setSelectedCategory(Number(value))
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
          <LibraryList novels={data || []} />
        </div>
      )}
    </>
  )
}

export { LibrarySection }

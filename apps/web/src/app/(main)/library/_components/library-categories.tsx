import { capitalize } from '@/lib/utils'

import { Category } from '@yomu/core/database/schema/web'
import { ToggleGroup, ToggleGroupItem } from '@yomu/ui/components/toggle-group'

import Link from 'next/link'

type LibraryCategoriesProps = {
  categories: Category[]
  defaultCategoryId: number
  selectedCategoryId: number
  setCategoryId: (categoryId: number) => void
}

function LibraryCategories({
  categories,
  defaultCategoryId,
  selectedCategoryId,
  setCategoryId,
}: LibraryCategoriesProps) {
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      type="single"
      defaultValue={`${defaultCategoryId}`}
      onValueChange={(value) => value && setCategoryId(Number(value))}
    >
      {categories.map((category) => (
        <ToggleGroupItem
          key={category.id}
          value={`${category.id}`}
          aria-checked={selectedCategoryId === category.id}
          data-state={selectedCategoryId === category.id ? 'on' : 'off'}
          asChild
        >
          <Link href={{ query: { categoryId: category.id } }}>
            {capitalize(category.name)}
          </Link>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export { LibraryCategories }

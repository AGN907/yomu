import { Category } from '@yomu/core/database/schema/web'
import { ToggleGroup, ToggleGroupItem } from '@yomu/ui/components/toggle-group'

type LibraryCategoriesProps = {
  categories: Category[]
  setCategoryId: (categoryId: number) => void
}

function LibraryCategories({
  categories,
  setCategoryId,
}: LibraryCategoriesProps) {
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      type="single"
      defaultValue="1"
      onValueChange={(value) => setCategoryId(Number(value))}
    >
      {categories.map((category) => (
        <ToggleGroupItem key={category.id} value={category.id.toString()}>
          {category.name.slice(0, 1).toUpperCase() + category.name.slice(1)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export { LibraryCategories }

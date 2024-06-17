import { capitalize } from '@/lib/utils'
import { DeleteCategoryItem } from './delete-category-item'
import { EditCategoryItem } from './edit-category-item'

import { Category } from '@yomu/core/database/schema/web'

type CategoryItemProps = {
  category: Category
}

function CategoryItem({ category }: CategoryItemProps) {
  return (
    <div className="grid rounded border px-4 py-2">
      <p className="font-medium">{capitalize(category.name)}</p>
      <div className="flex items-center justify-end">
        <div className="text-muted-foreground flex gap-2">
          <EditCategoryItem initialName={category.name} category={category} />
          <DeleteCategoryItem categoryId={category.id} />
        </div>
      </div>
    </div>
  )
}

export { CategoryItem }

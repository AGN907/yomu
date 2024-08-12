import { DeleteCategoryItem } from './delete-category-item'
import { EditCategoryItem } from './edit-category-item'

import { Category } from '@yomu/core/database/schema/web'
import { capitalize } from '@yomu/core/utils/string'
import { cn } from '@yomu/ui/utils'

type CategoryItemProps = {
  category: Category
}

function CategoryItem({ category }: CategoryItemProps) {
  const isDefaultCategory = category.default

  return (
    <div className="grid rounded border px-4 py-2">
      <p className="font-medium">{capitalize(category.name)}</p>
      <div className="flex items-center justify-end">
        <div
          className={cn(
            'text-muted-foreground flex gap-2',
            isDefaultCategory ? 'py-5' : '',
          )}
        >
          {isDefaultCategory ? null : (
            <>
              <EditCategoryItem
                initialName={category.name}
                category={category}
              />
              <DeleteCategoryItem categoryId={category.id} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { CategoryItem }

import { getCategories } from '@/lib/actions/categories'
import { CategoryItem } from './category-item'

async function CategoriesList() {
  const categories = await getCategories()

  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  )
}

export { CategoriesList }

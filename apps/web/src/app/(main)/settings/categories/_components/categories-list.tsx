import { assertAuthenticated } from '@/lib/session'
import { getCategoriesUseCase } from '@/use-cases/categories'
import { CategoryItem } from './category-item'

async function CategoriesList() {
  const user = await assertAuthenticated()
  const categories = await getCategoriesUseCase(user)

  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  )
}

export { CategoriesList }

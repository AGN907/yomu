import { CategoriesList } from './_components/categories-list'
import { CreateNewCategory } from './_components/create-new-category'

async function CategoriesSettings() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateNewCategory />
      </div>
      <div className="grid gap-4">
        <CategoriesList />
      </div>
    </div>
  )
}

export default CategoriesSettings

import { CategoriesList } from './_components/categories-list'

async function CategoriesSettings() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <CategoriesList />
      </div>
    </div>
  )
}

export default CategoriesSettings

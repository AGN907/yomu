import { getCategories } from '@/lib/actions/categories'
import { CreateNewCategory } from './_components/create-new-category'
import { LibrarySection } from './_components/library-section'

export const metadata = {
  title: 'Library - Yomu',
}

async function LibraryPage() {
  const categories = await getCategories()

  return (
    <div className="container flex flex-col">
      <div className="mb-4 flex items-center justify-between gap-8 md:justify-start">
        <h1 className="text-2xl font-semibold md:text-3xl">Library</h1>
        <CreateNewCategory />
      </div>
      <div className="flex flex-col space-y-8">
        <LibrarySection initialCategoryId={1} initialCategories={categories} />
      </div>
    </div>
  )
}

export default LibraryPage

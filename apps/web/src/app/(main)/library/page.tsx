import { getCategories } from '@/lib/actions/categories'
import { LibrarySection } from './_components/library-section'

export const metadata = {
  title: 'Library - Yomu',
}

async function LibraryPage() {
  const categories = await getCategories()

  return (
    <div className="container flex flex-col">
      <h1 className="mb-4 text-2xl font-semibold md:text-3xl">Library</h1>
      <div className="flex flex-col space-y-8">
        <LibrarySection initialCategoryId={1} initialCategories={categories} />
      </div>
    </div>
  )
}

export default LibraryPage

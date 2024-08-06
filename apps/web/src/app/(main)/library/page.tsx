import { getCategories } from '@/actions/categories'
import { PageLayout } from '@/components/page-layout'
import { LibrarySection } from './_components/library-section'

export const metadata = {
  title: 'Library - Yomu',
}

async function LibraryPage() {
  const categories = await getCategories()

  return (
    <PageLayout
      pageTitle={
        <div className="flex items-center gap-4">
          <h1>Library</h1>
        </div>
      }
    >
      <div className="flex flex-col space-y-8">
        <LibrarySection initialCategories={categories} />
      </div>
    </PageLayout>
  )
}

export default LibraryPage

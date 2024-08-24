import { PageLayout } from '@/components/page-layout'
import { assertAuthenticated } from '@/lib/session'
import { getCategoriesUseCase } from '@/use-cases/categories'
import { LibrarySection } from './_components/library-section'

export const metadata = {
  title: 'Library - Yomu',
}

type PageParams = {
  searchParams: {
    categoryId?: string
  }
}

async function LibraryPage({ searchParams }: PageParams) {
  const selectedCategoryId = Number(searchParams.categoryId)
  const user = await assertAuthenticated()
  const categories = await getCategoriesUseCase(user)

  return (
    <PageLayout
      pageTitle={
        <div className="flex items-center gap-4">
          <h1>Library</h1>
        </div>
      }
    >
      <div className="flex flex-col space-y-8">
        <LibrarySection
          user={user}
          initialCategories={categories}
          initialCategoryId={selectedCategoryId}
        />
      </div>
    </PageLayout>
  )
}

export default LibraryPage

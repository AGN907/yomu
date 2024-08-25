import { PageLayout } from '@/components/page-layout'
import { getUserUpdatesUseCase } from '@/use-cases/updates'
import { UpdatesList } from './_components/update-items-list'
import { assertAuthenticated } from '@/lib/session'

import type { UpdateItem } from '@yomu/sources/types'

export const metadata = {
  title: 'Updates - Yomu',
}

async function UpdatesPage() {
  const user = await assertAuthenticated()
  const updatesChapters = await getUserUpdatesUseCase(user)

  const groupedByDateArray = Object.entries(
    updatesChapters.reduce(
      (acc, chapter) => {
        const date = chapter.updatedAt.toLocaleDateString()

        if (!acc[date]) {
          acc[date] = []
        }
        if (!acc?.[date]?.find((item) => item.title === chapter.novelTitle)) {
          acc?.[date]?.push({ title: chapter.novelTitle, chapters: [] })
        }

        const index = acc?.[date]?.findIndex(
          (item) => item.title === chapter.novelTitle,
        )
        acc?.[date]?.[index as number]?.chapters?.push(chapter)

        return acc
      },
      {} as Record<string, { title: string; chapters: UpdateItem[] }[]>,
    ),
  )

  return (
    <PageLayout pageTitle="Updates">
      <div className="space-y-6">
        {groupedByDateArray.length === 0 ? (
          <p>You don&apos;t have any updates yet.</p>
        ) : (
          <>
            {groupedByDateArray.map(([date, updates]) => (
              <UpdatesList key={date} listName={date} items={updates} />
            ))}
          </>
        )}
      </div>
    </PageLayout>
  )
}

export default UpdatesPage

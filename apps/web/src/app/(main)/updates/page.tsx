import { PageLayout } from '@/components/page-layout'
import { getUpdatedChapters } from '@/lib/actions/updates'
import { UpdatesList } from './_components/update-items-list'

import type { UpdateItem } from '@yomu/sources/types'

export const metadata = {
  title: 'Updates - Yomu',
}

async function UpdatesPage() {
  const updatesChapters = (await getUpdatedChapters()) || []

  const groupedByDateArray = Object.entries(
    updatesChapters.reduce<
      Record<string, { title: string; chapters: UpdateItem[] }[]>
    >((acc, chapter) => {
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
    }, {}),
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

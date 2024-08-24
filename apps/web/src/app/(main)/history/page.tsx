import { PageLayout } from '@/components/page-layout'
import { HistoryItemsList } from './_components/history-items-list'
import { assertAuthenticated } from '@/lib/session'
import { getUserHistoryUseCase } from '@/use-cases/history'

import type { HistoryItem } from '@yomu/sources/types'

export const metadata = {
  title: 'History - Yomu',
}

async function HistoryPage() {
  const user = await assertAuthenticated()
  const historyChapters = await getUserHistoryUseCase(user)

  const groupedByDateArray = Object.entries(
    historyChapters.reduce(
      (acc, chapter) => {
        const date = chapter.updatedAt.toLocaleDateString()
        if (!acc[date]) {
          acc[date] = []
        }
        acc?.[date]?.push(chapter)
        return acc
      },
      {} as Record<string, HistoryItem[]>,
    ),
  )

  return (
    <PageLayout pageTitle="History">
      <div className="space-y-6">
        {groupedByDateArray.length === 0 ? (
          <p>You don&apos;t have any reading history yet.</p>
        ) : (
          <>
            {groupedByDateArray.map(([date, chapters]) => (
              <HistoryItemsList key={date} listName={date} items={chapters} />
            ))}
          </>
        )}
      </div>
    </PageLayout>
  )
}

export default HistoryPage

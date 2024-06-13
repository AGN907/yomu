import { PageLayout } from '@/components/page-layout'
import {
  getHistoryChapters,
  type HistoryItemWithTimestamps,
} from '@/lib/actions/history'
import { HistoryItemsList } from './_components/history-items-list'

async function HistoryPage() {
  const historyChapters = await getHistoryChapters()

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
      {} as Record<string, HistoryItemWithTimestamps[]>,
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

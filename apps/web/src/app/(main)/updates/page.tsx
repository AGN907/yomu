import { getUpdatedChapters } from '@/lib/actions/updates'
import { UpdatesList } from './_components/update-items-list'

import type { UpdateItem } from '@yomu/sources/types'

async function UpdatesPage() {
  const updatesChapters = await getUpdatedChapters()

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
    <div className="container">
      <h1 className="mb-4 text-2xl font-semibold md:text-3xl">Updates</h1>
      <div>
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
    </div>
  )
}

export default UpdatesPage

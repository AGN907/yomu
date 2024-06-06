import { HistoryItemCard } from './history-item-card'

import { toCalendar } from '@yomu/core/date-helpers'
import type { HistoryItem } from '@yomu/sources/types'

function HistoryItemsList({
  items,
  listName,
}: {
  items: HistoryItem[]
  listName: string
}) {
  const sectionName = toCalendar(listName)

  return (
    <div>
      <h3 className="mb-4 text-lg font-medium">{sectionName}</h3>
      <div className="grid gap-4">
        {items.map((item) => (
          <HistoryItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export { HistoryItemsList }

import { slugify } from '@yomu/core/utils/string'
import type { UpdateItem } from '@yomu/sources/types'

import Link from 'next/link'

type ChapterUpdateCardProps = {
  item: UpdateItem
}

function UpdateItemCard({ item }: ChapterUpdateCardProps) {
  const { novelId, novelTitle, chapterNumber } = item

  return (
    <div className="p-4">
      <div className="text-muted-foreground text-sm">
        <Link
          href={`/novels/${novelId}/${slugify(novelTitle)}/chapter-${chapterNumber}`}
          className="hover:underline"
        >
          Chapter {chapterNumber}
        </Link>
      </div>
    </div>
  )
}

export { UpdateItemCard }

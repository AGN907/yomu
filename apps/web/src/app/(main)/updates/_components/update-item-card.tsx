import type { UpdateItem } from '@yomu/sources/types'

import Link from 'next/link'

type ChapterUpdateCardProps = {
  item: UpdateItem
}

function UpdateItemCard({ item }: ChapterUpdateCardProps) {
  const { novelSlug, chapterNumber } = item

  const chapterPath = `/novels/${novelSlug}/${chapterNumber}`
  const chapterQuery = {
    chapterId: item.chapterId,
  }

  return (
    <div className="p-4">
      <div className="text-muted-foreground text-sm">
        <Link
          href={{
            pathname: chapterPath,
            query: chapterQuery,
          }}
          className="hover:underline"
        >
          Chapter {chapterNumber}
        </Link>
      </div>
    </div>
  )
}

export { UpdateItemCard }

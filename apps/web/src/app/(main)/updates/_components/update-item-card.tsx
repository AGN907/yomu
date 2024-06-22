import type { UpdateItem } from '@yomu/sources/types'

import Link from 'next/link'

type ChapterUpdateCardProps = {
  item: UpdateItem
}

function UpdateItemCard({ item }: ChapterUpdateCardProps) {
  const { chapterId, chapterNumber } = item

  return (
    <div className="p-4">
      <div className="text-muted-foreground text-sm">
        <Link
          href={{
            pathname: `/novel/${chapterNumber}`,
            query: {
              chapterId,
            },
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

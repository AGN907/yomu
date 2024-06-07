import type { UpdateItem } from '@yomu/sources/types'

import Link from 'next/link'

type ChapterUpdateCardProps = {
  item: UpdateItem
}

function UpdateItemCard({ item }: ChapterUpdateCardProps) {
  const { chapterTitle, chapterId, chapterNumber } = item

  return (
    <div className="border-b p-4">
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
          <p>{chapterTitle}</p>
        </Link>
      </div>
    </div>
  )
}

export { UpdateItemCard }

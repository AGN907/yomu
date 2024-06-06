import type { HistoryItem } from '@yomu/sources/types'

import Image from 'next/image'
import Link from 'next/link'

function HistoryItemCard({ item }: { item: HistoryItem }) {
  const {
    id,
    novelTitle,
    novelUrl,
    novelThumbnail,
    chapterId,
    chapterTitle,
    chapterNumber,
    sourceId,
  } = item

  return (
    <div key={id} className="flex items-start rounded-lg border p-4">
      <div className="mr-4">
        <Image
          alt={novelTitle}
          className="rounded-md"
          height={100}
          src={novelThumbnail}
          style={{
            aspectRatio: '70/100',
            objectFit: 'cover',
          }}
          width={70}
        />
      </div>
      <div className="flex-1">
        <div className="mb-2 flex items-center justify-between">
          <Link
            href={{
              pathname: '/novel',
              query: {
                sourceId,
                novelUrl,
              },
            }}
            className="hover:underline"
          >
            <h3 className="text-lg font-medium">{novelTitle}</h3>
          </Link>
          <div className="text-muted-foreground text-sm">
            {/* TODO: Add delete action */}
          </div>
        </div>
        <div className="text-muted-foreground mb-2 text-sm">
          <Link
            href={{
              pathname: `novel/${chapterNumber}`,
              query: {
                chapterId,
              },
            }}
            className="hover:underline"
          >
            {chapterTitle}
          </Link>
        </div>
      </div>
    </div>
  )
}

export { HistoryItemCard }

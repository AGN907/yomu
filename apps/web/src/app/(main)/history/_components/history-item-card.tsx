import type { HistoryItemWithTimestamps } from '@/lib/actions/history'
import { dayjs } from '@yomu/core/date-helpers'

import Image from 'next/image'
import Link from 'next/link'

export type HistoryItemCardProps = {
  item: HistoryItemWithTimestamps
}

function HistoryItemCard({ item }: HistoryItemCardProps) {
  const {
    novelTitle,
    novelUrl,
    novelThumbnail,
    chapterId,
    chapterNumber,
    sourceId,
    updatedAt,
  } = item

  return (
    <div className="rounded-lg border p-4">
      <div className="grid grid-cols-[50px_1fr] gap-4">
        <Link
          href={{
            pathname: '/novel',
            query: {
              sourceId,
              novelUrl,
            },
          }}
        >
          <Image
            className="rounded object-cover"
            src={novelThumbnail}
            alt={novelTitle}
            width={50}
            height={80}
          />
        </Link>
        <div className="grid min-w-0 grid-rows-2">
          <p className="truncate font-medium">{novelTitle}</p>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Link
              href={{
                pathname: `novel/${chapterNumber}`,
                query: {
                  chapterId,
                },
              }}
              className="hover:underline"
            >
              Chapter {chapterNumber}
            </Link>
            <span className="bg-muted-foreground size-1 rounded-full"></span>
            <span>{dayjs(updatedAt).format('hh:mm A')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { HistoryItemCard }

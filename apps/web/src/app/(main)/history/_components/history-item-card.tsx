import type { HistoryItemWithTimestamps } from '@/lib/actions/history'
import { slugify } from '@/lib/utils'

import { dayjs } from '@yomu/core/date-helpers'

import Image from 'next/image'
import Link from 'next/link'

export type HistoryItemCardProps = {
  item: HistoryItemWithTimestamps
}

function HistoryItemCard({ item }: HistoryItemCardProps) {
  const { novelId, novelTitle, novelThumbnail, chapterNumber, updatedAt } = item

  const novelSlug = slugify(novelTitle)

  return (
    <div className="rounded-lg border p-4">
      <div className="grid grid-cols-[50px_1fr] gap-4">
        <Link href={`/novels/${novelId}/${novelSlug}`}>
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
              href={`/novels/${novelId}/${novelSlug}/chapter-${chapterNumber}`}
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

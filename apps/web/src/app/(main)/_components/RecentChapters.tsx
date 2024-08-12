import { CardContainer } from '@/components/card-container'
import { getLatestUpdatedChapters } from '@/lib/actions/chapters'

import { formatReleaseDate } from '@yomu/core/utils/dates'

import Image from 'next/image'
import Link from 'next/link'

export async function RecentChapters() {
  const { data: recentChapters = [] } = await getLatestUpdatedChapters({
    limit: 5,
  })

  const isRecentChaptersEmpty = recentChapters.length === 0

  return (
    <div className="h-full">
      <CardContainer title={'Recent Chapters'}>
        <div className="divide-border divide-y">
          {isRecentChaptersEmpty ? (
            <div className="flex flex-col items-center justify-center md:pt-14">
              <p className="text-xl">There&apos;s no recent updates</p>
              <p className="text-muted-foreground">
                Check back after updating novels
              </p>
            </div>
          ) : (
            recentChapters.map(
              ({
                novelId,
                novelTitle,
                novelSlug,
                novelThumbnail,
                chapterId,
                chapterTitle,
                chapterNumber,
                updatedAt,
              }) => (
                <div
                  className="grid grid-cols-[40px_1fr] items-center gap-2 py-1"
                  key={chapterId}
                >
                  <Link
                    className="block hover:underline"
                    href={`/novels/${novelId}/${novelSlug}`}
                  >
                    <Image
                      className="rounded"
                      src={novelThumbnail}
                      alt={novelTitle}
                      width={50}
                      height={80}
                    />
                  </Link>
                  <div className="flex w-full min-w-0 flex-col">
                    <Link
                      className="truncate font-medium hover:underline"
                      href={`/novels/${novelId}/${novelSlug}`}
                    >
                      {novelTitle}
                    </Link>

                    <Link
                      className="truncate text-sm hover:underline"
                      href={`/novels/${novelId}/${novelSlug}/${chapterNumber}`}
                    >
                      {chapterTitle}
                    </Link>
                    <span className="text-muted-foreground ml-auto flex-shrink-0 text-xs">
                      {formatReleaseDate(updatedAt)}
                    </span>
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </CardContainer>
    </div>
  )
}

import { CardContainer } from '@/components/card-container'
import { getLatestUpdatedChapters } from '@/lib/actions/chapters'

import { formatReleaseDate } from '@yomu/core/date-helpers'

import Image from 'next/image'
import Link from 'next/link'

export async function RecentChapters() {
  const recentChapters = await getLatestUpdatedChapters(5)

  const isRecentChaptersEmpty = recentChapters.length === 0

  return (
    <div className="">
      <CardContainer title={'Recent Chapters'}>
        <div className="divide-border h-full divide-y">
          {isRecentChaptersEmpty ? (
            <div className="flex items-center justify-center">
              <p>No recent chapters</p>
            </div>
          ) : (
            recentChapters.map((chapter) => (
              <div
                className="grid grid-cols-[40px_1fr] items-center gap-2 py-1"
                key={chapter.chapterId}
              >
                <Link
                  className="block hover:underline"
                  href={{
                    pathname: '/novel',
                    query: {
                      novelUrl: chapter.novelUrl,
                      sourceId: chapter.sourceId,
                    },
                  }}
                >
                  <Image
                    className="rounded"
                    src={chapter.novelThumbnail}
                    alt={chapter.novelTitle}
                    width={50}
                    height={80}
                  />
                </Link>
                <div className="flex w-full min-w-0 flex-col">
                  <Link
                    className="truncate font-medium hover:underline"
                    href={{
                      pathname: '/novel',
                      query: {
                        novelUrl: chapter.novelUrl,
                        sourceId: chapter.sourceId,
                      },
                    }}
                  >
                    {chapter.novelTitle}
                  </Link>

                  <Link
                    className="truncate text-sm hover:underline"
                    href={{
                      pathname: `/novel/${chapter.chapterNumber}`,
                      query: { chapterId: chapter.chapterId },
                    }}
                  >
                    {chapter.chapterTitle}
                  </Link>
                  <span className="text-muted-foreground ml-auto flex-shrink-0 text-xs">
                    {formatReleaseDate(chapter.updatedAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContainer>
    </div>
  )
}

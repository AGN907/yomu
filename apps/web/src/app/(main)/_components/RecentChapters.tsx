import { CardContainer } from '@/components/card-container'
import { getLatestUpdatedChapters } from '@/lib/actions/chapters'

import { formatReleaseDate } from '@yomu/core/date-helpers'

import Image from 'next/image'
import Link from 'next/link'

export async function RecentChapters() {
  const recentChapters = await getLatestUpdatedChapters(5)

  return (
    <div className="">
      <CardContainer title={'Recent Chapters'}>
        <div className="divide-border divide-y">
          {recentChapters.map((chapter) => (
            <div
              className="grid grid-cols-[40px_1fr] items-center gap-2 py-2"
              key={chapter.novelId}
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
                  src={'/lord-of-the-mysteries-2.jpg'}
                  alt={chapter.novelTitle}
                  width={30}
                  height={40}
                />
              </Link>
              <div className="flex w-full min-w-0 flex-col">
                <Link
                  className="truncate font-semibold hover:underline"
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
          ))}
        </div>
      </CardContainer>
    </div>
  )
}

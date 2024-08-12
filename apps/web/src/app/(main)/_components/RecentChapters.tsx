import { CardContainer } from '@/components/card-container'
import { getLatestUpdatedChapters } from '@/lib/actions/updates'

import { formatReleaseDate } from '@yomu/core/utils/dates'

import Image from 'next/image'
import Link from 'next/link'

export async function RecentChapters() {
  const { data: recentChapters = [] } = await getLatestUpdatedChapters({
    limit: 5,
  })

  const isRecentChaptersEmpty = recentChapters.length === 0

  const renderItem = (item: (typeof recentChapters)[0], index: number) => {
    const {
      sourceId,
      novelTitle,
      novelSlug,
      novelUrl,
      novelThumbnail,
      chapterId,
      chapterTitle,
      chapterNumber,
      updatedAt,
    } = item

    const novelPath = `/novels/${novelSlug}`
    const chapterPath = novelPath + `/${chapterNumber}`

    const novelQuery = {
      sourceId,
      novelUrl,
    }
    const chapterQuery = {
      chapterId: chapterId,
    }

    return (
      <div
        className="grid grid-cols-[40px_1fr] items-center gap-2 py-1"
        key={chapterId}
      >
        <Link
          className="block hover:underline"
          href={{
            pathname: novelPath,
            query: novelQuery,
          }}
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
            href={{
              pathname: novelPath,
              query: novelQuery,
            }}
          >
            {novelTitle}
          </Link>

          <Link
            className="truncate text-sm hover:underline"
            href={{
              pathname: chapterPath,
              query: chapterQuery,
            }}
          >
            {chapterTitle}
          </Link>
          <span className="text-muted-foreground ml-auto flex-shrink-0 text-xs">
            {formatReleaseDate(updatedAt)}
          </span>
        </div>
      </div>
    )
  }

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
            recentChapters.map(renderItem)
          )}
        </div>
      </CardContainer>
    </div>
  )
}

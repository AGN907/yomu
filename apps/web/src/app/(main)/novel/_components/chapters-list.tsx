import type { Chapter } from '@yomu/core/database/schema/web'
import { toCalendar } from '@yomu/core/date-helpers'
import { cn } from '@yomu/ui/utils'

import Link from 'next/link'

type ChaptersListProps = {
  chapters: Chapter[]
}

function ChaptersList({ chapters }: ChaptersListProps) {
  return (
    <div>
      {chapters.map((chapter) => (
        <Link
          key={chapter.id}
          href={{
            pathname: `/novel/${chapter.number}`,
            query: {
              chapterId: chapter.id,
            },
          }}
        >
          <div className="bg-card flex items-center justify-between gap-8 rounded border px-2 py-4">
            <p
              title={chapter.title}
              className={cn(
                'flex-1 hover:underline',
                chapter.read && 'text-muted-foreground',
              )}
            >
              {chapter.title}
            </p>
            <span className="text-muted-foreground text-sm">
              {toCalendar(chapter.releaseDate.toDateString())}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export { ChaptersList }

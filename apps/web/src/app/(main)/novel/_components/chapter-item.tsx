import { Chapter } from '@yomu/core/database/schema/web'
import { toCalendar } from '@yomu/core/date-helpers'
import { Input } from '@yomu/ui/components/input'
import { Label } from '@yomu/ui/components/label'
import { cn } from '@yomu/ui/utils'

import Link from 'next/link'

type ChapterItemProps = {
  chapter: Chapter
  isSelected: boolean
  onSelect: (id: number) => void
}

function ChapterItem({ chapter, isSelected, onSelect }: ChapterItemProps) {
  const { id, title, number, read, releaseDate } = chapter

  return (
    <Label
      key={id}
      className="bg-card group flex items-center gap-4 rounded border px-2 py-4"
    >
      <Input
        onChange={() => onSelect(chapter.id)}
        checked={isSelected}
        type="checkbox"
        className={cn(
          'max-w-5 opacity-0 transition-opacity delay-300',
          isSelected ? 'opacity-100' : 'group-hover:opacity-100',
        )}
      />
      <div className="flex flex-1 justify-between">
        <Link
          key={id}
          href={{
            pathname: `/novel/${number}`,
            query: {
              chapterId: id,
            },
          }}
          title={title}
          className={cn('hover:underline', read && 'text-muted-foreground')}
        >
          {title}
        </Link>
        <span className="text-muted-foreground text-sm">
          {toCalendar(releaseDate.toDateString())}
        </span>
      </div>
    </Label>
  )
}

export { ChapterItem }

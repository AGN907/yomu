import { Chapter } from '@yomu/core/database/schema/web'
import { toCalendar } from '@yomu/core/utils/dates'
import { Input } from '@yomu/ui/components/input'
import { Label } from '@yomu/ui/components/label'
import { cn } from '@yomu/ui/utils'

import Link from 'next/link'
import { useParams } from 'next/navigation'

type ChapterItemProps = {
  chapter: Chapter
  isSelected: boolean
  onSelect: (id: number) => void
}

function ChapterItem({ chapter, isSelected, onSelect }: ChapterItemProps) {
  const { id, title, number, read, releaseDate } = chapter
  const { slug } = useParams()

  const chapterPath = `/novels/${slug}/${number}`
  const chapterQuery = {
    chapterId: id,
  }

  return (
    <Label className="bg-card group grid grid-cols-[2rem_1fr_auto] items-center gap-4 rounded border px-2 py-4">
      <Input
        onChange={() => onSelect(chapter.id)}
        checked={isSelected}
        type="checkbox"
        className={cn(
          'max-w-5 opacity-0 transition-opacity delay-100',
          isSelected ? 'opacity-100' : 'group-hover:opacity-100',
        )}
      />
      <Link
        key={id}
        href={{
          pathname: chapterPath,
          query: chapterQuery,
        }}
        title={title}
        className={cn(
          'truncate hover:underline',
          read && 'text-muted-foreground',
        )}
      >
        {title}
      </Link>
      <span className="text-muted-foreground ml-auto flex-shrink-0 text-xs">
        {toCalendar(releaseDate.toDateString())}
      </span>
    </Label>
  )
}

export { ChapterItem }

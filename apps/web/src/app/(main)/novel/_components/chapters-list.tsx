'use client'

import type { Chapter } from '@yomu/core/database/schema/web'
import { toCalendar } from '@yomu/core/date-helpers'
import { Input } from '@yomu/ui/components/input'
import { Label } from '@yomu/ui/components/label'
import { cn } from '@yomu/ui/utils'

import Link from 'next/link'
import { useState } from 'react'

type ChaptersListProps = {
  chapters: Chapter[]
}

function ChaptersList({ chapters }: ChaptersListProps) {
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set())

  const handleCheck = (id: number) => {
    const newCheckedIds = new Set(checkedIds)
    if (newCheckedIds.has(id)) {
      newCheckedIds.delete(id)
    } else {
      newCheckedIds.add(id)
    }

    setCheckedIds(newCheckedIds)
  }

  return (
    <div className="space-y-4">
      {checkedIds.size > 0 ? (
        <div className="bg-accent flex items-center justify-between rounded border px-2 py-1">
          <p className="text-sm">{checkedIds.size} chapter selected</p>
        </div>
      ) : null}
      {chapters.map((chapter) => (
        <Label
          key={chapter.id}
          className="bg-card group flex items-center gap-4 rounded border px-2 py-4"
        >
          <Input
            onChange={() => handleCheck(chapter.id)}
            checked={checkedIds.has(chapter.id)}
            type="checkbox"
            className={cn(
              'max-w-5 opacity-0 transition-opacity delay-300',
              checkedIds.has(chapter.id)
                ? 'opacity-100'
                : 'group-hover:opacity-100',
            )}
          />
          <div className="flex flex-1 justify-between">
            <Link
              key={chapter.id}
              href={{
                pathname: `/novel/${chapter.number}`,
                query: {
                  chapterId: chapter.id,
                },
              }}
              title={chapter.title}
              className={cn(
                'hover:underline',
                chapter.read && 'text-muted-foreground',
              )}
            >
              {chapter.title}
            </Link>
            <span className="text-muted-foreground text-sm">
              {toCalendar(chapter.releaseDate.toDateString())}
            </span>
          </div>
        </Label>
      ))}
    </div>
  )
}

export { ChaptersList }

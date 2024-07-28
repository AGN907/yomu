'use client'

import { markChapterAsRead } from '@/lib/actions/chapters'
import { Chapter } from '@yomu/core/database/schema/web'
import { Button } from '@yomu/ui/components/button'

import { ChapterItem } from './chapter-item'

import { useState } from 'react'

type ChaptersListProps = {
  chapters: Chapter[]
}

function ChaptersList({ chapters }: ChaptersListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const handleCheck = (id: number) => {
    const newCheckedIds = new Set(selectedIds)
    if (newCheckedIds.has(id)) {
      newCheckedIds.delete(id)
    } else {
      newCheckedIds.add(id)
    }

    setSelectedIds(newCheckedIds)
  }

  const markAsRead = async () => {
    if (selectedIds.size === 0) return

    await markChapterAsRead({
      chapterIds: [...selectedIds],
    })

    setSelectedIds(new Set())
  }

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 ? (
        <div className="bg-accent flex items-center justify-between rounded border px-2 py-1">
          <p className="text-sm">{selectedIds.size} chapter selected</p>
          <div className="flex gap-4">
            <Button onClick={markAsRead} variant="outline" size="sm">
              Mark read
            </Button>
          </div>
        </div>
      ) : null}
      {chapters.map((chapter) => (
        <ChapterItem
          key={chapter.id}
          chapter={chapter}
          isSelected={selectedIds.has(chapter.id)}
          onSelect={handleCheck}
        />
      ))}
    </div>
  )
}

export { ChaptersList }

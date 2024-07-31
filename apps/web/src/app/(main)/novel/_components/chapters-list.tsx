'use client'

import { updateReadState } from '@/lib/actions/chapters'
import { ChapterItem } from './chapter-item'

import { Chapter } from '@yomu/core/database/schema/web'
import { Button } from '@yomu/ui/components/button'
import { Check, CheckCheck } from '@yomu/ui/components/icons'
import { cn } from '@yomu/ui/utils'

import { useCallback, useMemo, useState } from 'react'

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

  const markAsRead = useCallback(async () => {
    if (selectedIds.size === 0) return

    const unreadSelectedChapters = Array.from(selectedIds).filter(
      (id) => !chapters.find((chapter) => chapter.id === id)?.read,
    )

    await updateReadState({
      chapterIds: unreadSelectedChapters,
      read: true,
    })

    setSelectedIds(new Set())
  }, [selectedIds, chapters])

  const markAsUnread = useCallback(() => {
    if (selectedIds.size === 0) return

    const readSelectedChapters = Array.from(selectedIds).filter(
      (id) => chapters.find((chapter) => chapter.id === id)?.read,
    )

    updateReadState({
      chapterIds: readSelectedChapters,
      read: false,
    })

    setSelectedIds(new Set())
  }, [chapters, selectedIds])

  const actions = useMemo(() => {
    const actionsList = []

    if (
      chapters
        .filter((chapter) => selectedIds.has(chapter.id))
        .some((chapter) => !chapter.read)
    ) {
      actionsList.push(
        <Button
          className="gap-2"
          onClick={markAsRead}
          variant="outline"
          size="icon"
        >
          <Check className="size-5" />
          <span className="sr-only">Mark chapter as read</span>
        </Button>,
      )
    }

    if (
      chapters
        .filter((chapter) => selectedIds.has(chapter.id))
        .some((chapter) => chapter.read)
    ) {
      actionsList.push(
        <Button
          className="gap-2"
          onClick={markAsUnread}
          variant="outline"
          size="icon"
        >
          <CheckCheck className="size-5" />
          <span className="sr-only">Mark chapter as unread</span>
        </Button>,
      )
    }
    return actionsList
  }, [selectedIds, chapters, markAsRead, markAsUnread])

  return (
    <div className="w-full space-y-2">
      <h3 className="text-2xl font-medium">Chapters</h3>
      <div
        className={cn(
          'bg-accent flex items-center justify-between px-2 py-1 transition-opacity',
          selectedIds.size > 0 ? 'opacity-100 delay-200' : 'opacity-0 delay-0',
        )}
      >
        <p className="text-sm">{selectedIds.size} chapter selected</p>
        <div className="flex gap-4">{actions?.map((action) => action)}</div>
      </div>
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

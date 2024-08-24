import {
  markChapterAsReadAction,
  markChapterAsUnreadAction,
} from '@/actions/chapters'
import { getQueryClient } from '@/providers'

import { Chapter } from '@yomu/core/database/schema/web'
import { Button } from '@yomu/ui/components/button'
import { Check, CheckCheck } from '@yomu/ui/components/icons'
import { cn } from '@yomu/ui/utils'

import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'

type ActionsBarProps = {
  chapters: Chapter[]
  selectedIds: Set<number>
  onSelectedChange: (ids: Set<number>) => void
}

function ActionsBar({
  chapters,
  selectedIds,
  onSelectedChange,
}: ActionsBarProps) {
  const markAsReadMutation = useMutation({
    mutationFn: markChapterAsReadAction,
    onSuccess: () => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({
        queryKey: ['chapters', chapters[0].novelId],
      })
      onSelectedChange(new Set())
    },
  })

  const markAsUnreadMutation = useMutation({
    mutationFn: markChapterAsUnreadAction,
    onSuccess() {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({
        queryKey: ['chapters', chapters[0].novelId],
      })
    },
  })

  const actions = useMemo(() => {
    const actionsList = []

    if (
      chapters
        .filter((chapter) => selectedIds.has(chapter.id))
        .some((chapter) => !chapter.read)
    ) {
      const unreadSelectedChapters = Array.from(selectedIds).filter(
        (id) => !chapters.find((chapter) => chapter.id === id)?.read,
      )
      actionsList.push(
        <Button
          className="gap-2"
          onClick={() =>
            markAsReadMutation.mutate({
              chapterIds: unreadSelectedChapters,
            })
          }
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
      const readSelectedChapters = Array.from(selectedIds).filter(
        (id) => chapters.find((chapter) => chapter.id === id)?.read,
      )
      actionsList.push(
        <Button
          className="gap-2"
          onClick={() =>
            markAsUnreadMutation.mutate({
              chapterIds: readSelectedChapters,
            })
          }
          variant="outline"
          size="icon"
        >
          <CheckCheck className="size-5" />
          <span className="sr-only">Mark chapter as unread</span>
        </Button>,
      )
    }
    return actionsList
  }, [selectedIds, chapters, markAsReadMutation, markAsUnreadMutation])

  const numberOfSelected = selectedIds.size

  return (
    <div
      className={cn(
        'bg-muted flex items-center justify-between rounded px-2 py-1 transition-opacity',
        numberOfSelected > 0 ? 'opacity-100 delay-200' : 'opacity-0 delay-0',
      )}
    >
      <p>{numberOfSelected} chapter selected</p>
      <div className="flex gap-2">{actions?.map((action) => action)}</div>
    </div>
  )
}

export { ActionsBar }

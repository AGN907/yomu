import { updateReadState } from '@/lib/actions/chapters'
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
  const readStateMutation = useMutation({
    mutationFn: updateReadState,
    onSuccess: () => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({
        queryKey: ['chapters'],
      })
      onSelectedChange(new Set())
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
            readStateMutation.mutate({
              chapterIds: unreadSelectedChapters,
              read: true,
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
            readStateMutation.mutate({
              chapterIds: readSelectedChapters,
              read: false,
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
  }, [selectedIds, chapters, readStateMutation])

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

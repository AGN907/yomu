'use client'

import { ActionsBar } from './actions-bar'
import { ChapterItem } from './chapter-item'

import Spinner from '@/components/spinner'

import { useState } from 'react'
import { useNovelChapters } from './use-novel-chapters'

type ChaptersListProps = {
  novelId: number
}

function ChaptersList({ novelId }: ChaptersListProps) {
  const { data: chapters, isPending } = useNovelChapters(novelId)
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

  const numberOfChapters = chapters.length

  return (
    <div className="w-full space-y-2">
      <h3 className="text-2xl font-medium">
        {numberOfChapters} {numberOfChapters === 1 ? 'chapter' : 'chapters'}
      </h3>
      <div className="space-y-2">
        <ActionsBar
          chapters={chapters}
          selectedIds={selectedIds}
          onSelectedChange={(newSet) => setSelectedIds(newSet)}
        />

        {isPending ? (
          <Spinner size={48} />
        ) : (
          <div className="space-y-1">
            {chapters.map((chapter) => (
              <ChapterItem
                key={chapter.id}
                chapter={chapter}
                isSelected={selectedIds.has(chapter.id)}
                onSelect={handleCheck}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { ChaptersList }

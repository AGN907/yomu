'use client'

import { getNovelChapters } from '@/actions/chapters'
import { ActionsBar } from './actions-bar'
import { ChapterItem } from './chapter-item'

import Spinner from '@/components/spinner'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type ChaptersListProps = {
  novelId: number
}

function ChaptersList({ novelId }: ChaptersListProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['chapters', novelId],
    queryFn: () => getNovelChapters({ novelId }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
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

  const chapters = data?.data ?? []
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

        {isLoading ? (
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

'use client'

import { addNovelToLibrary } from '@/lib/actions/novels'

import { Button } from '@yomu/ui/components/button'
import { Bookmark } from '@yomu/ui/components/icons'
import { cn } from '@yomu/ui/utils'

import { useAction } from 'next-safe-action/hooks'
import { useOptimistic } from 'react'

type AddToLibraryProps = {
  novelId: number
  inLibrary: boolean
}

function AddToLibrary({ novelId, inLibrary }: AddToLibraryProps) {
  const { execute } = useAction(addNovelToLibrary)
  const [optimisticInLibrary, setOptimisticInLibrary] = useOptimistic(
    inLibrary,
    (state) => !state,
  )

  return (
    <form
      action={() => {
        setOptimisticInLibrary(!inLibrary)
        execute({ novelId, inLibrary })
      }}
    >
      <Button variant="outline" size="icon">
        <Bookmark
          size={24}
          className={cn(
            optimisticInLibrary && 'fill-yellow-500 stroke-yellow-500',
          )}
        />
      </Button>
    </form>
  )
}

export { AddToLibrary }

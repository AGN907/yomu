'use client'

import { updateNovel } from '@/actions/updates'
import Spinner from '@/components/spinner'

import { Button } from '@yomu/ui/components/button'
import { RefreshCw } from '@yomu/ui/components/icons'
import { toast } from '@yomu/ui/components/sonner'

import { useAction } from 'next-safe-action/hooks'

type UpdateNovelDataProps = {
  novelId: number
}

function UpdateNovelData({ novelId }: UpdateNovelDataProps) {
  const { execute: updateNovelData, status: updateNovelStatus } = useAction(
    updateNovel,
    {
      onExecute: () => {
        toast('Updating novel...', {
          id: 'update-novel-data',
        })
      },
      onSettled: (result) => {
        const { data } = result
        if (data?.error) {
          toast.error(data.error)
        }
      },
      onSuccess: (data) => {
        toast.dismiss('update-novel-data')
        toast.success(data?.success)
      },
      onError: (err) => {
        toast.dismiss('update-novel-data')
        toast.error(err.fetchError || err.serverError)
      },
    },
  )

  return (
    <Button
      onClick={() => updateNovelData({ novelId })}
      size="icon"
      variant="outline"
    >
      <span className="sr-only">Update novel</span>
      {updateNovelStatus === 'executing' ? (
        <Spinner className="size-6" />
      ) : (
        <RefreshCw className="size-6" />
      )}
    </Button>
  )
}

export { UpdateNovelData }

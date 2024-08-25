'use client'

import Spinner from '@/components/spinner'
import { updateNovelDetailsAction } from '@/actions/novels'
import { getQueryClient } from '@/providers'

import { Button } from '@yomu/ui/components/button'
import { RefreshCw } from '@yomu/ui/components/icons'
import { toast } from '@yomu/ui/components/sonner'

import { useServerAction } from 'zsa-react'

type UpdateNovelDataProps = {
  novelId: number
}

function UpdateNovelData({ novelId }: UpdateNovelDataProps) {
  const { execute, isPending } = useServerAction(updateNovelDetailsAction, {
    onStart: () => {
      toast.loading('Updating novel', {
        id: 'update-novel-toast',
      })
    },
    onFinish: () => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: ['chapters', novelId] })
    },
    onSuccess: () => {
      toast.dismiss('update-novel-toast')
      toast.success('Novel Update', {
        description: 'Novel was successfully updated',
      })
    },
    onError: ({ err }) => {
      toast.dismiss('update-novel-toast')
      toast.error('Novel Update', {
        description: err.message,
      })
    },
  })

  return (
    <Button onClick={() => execute({ novelId })} size="icon" variant="outline">
      <span className="sr-only">Update novel</span>
      {isPending ? (
        <Spinner className="size-6" />
      ) : (
        <RefreshCw className="size-6" />
      )}
    </Button>
  )
}

export { UpdateNovelData }

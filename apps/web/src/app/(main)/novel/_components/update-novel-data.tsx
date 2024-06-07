'use client'

import { SubmitButton } from '@/components/submit-button'
import { updateNovel } from '@/lib/actions/updates'

import { RefreshCw } from '@yomu/ui/components/icons'
import { toast } from '@yomu/ui/components/sonner'

type UpdateNovelDataProps = {
  novelId: number
}

function UpdateNovelData({ novelId }: UpdateNovelDataProps) {
  const handleNovelUpdate = async () => {
    const actionPromise = updateNovel(novelId)

    toast.promise(actionPromise, {
      loading: 'Updating novel...',
      success: (data) => data?.success,
      error: (err) => err.error,
    })
  }

  return (
    <form action={handleNovelUpdate}>
      <SubmitButton size="icon" variant="outline">
        <span className="sr-only">Update novel</span>
        <RefreshCw className="size-6" />
      </SubmitButton>
    </form>
  )
}

export { UpdateNovelData }

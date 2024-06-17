'use client'

import Spinner from '@/components/spinner'
import { updateNovelsByCategory } from '@/lib/actions/novels'

import { Button } from '@yomu/ui/components/button'
import { RefreshCw } from '@yomu/ui/components/icons'
import { toast } from '@yomu/ui/components/sonner'

import { useAction } from 'next-safe-action/hooks'

export function UpdateCategoryNovels({ categoryId }: { categoryId: number }) {
  const { execute: updateNovels, status: updateStatus } = useAction(
    updateNovelsByCategory,
    {
      onExecute() {
        toast.loading('Updating novels...', { id: 'update-category-novels' })
      },
      onSettled(result) {
        const { data } = result
        if (data?.error) {
          toast.error(data.error)
        }
      },
      onSuccess(result) {
        toast.dismiss('update-category-novels')
        toast.success(result.success)
      },
      onError(err) {
        toast.dismiss('update-category-novels')
        toast.error(err.fetchError || err.serverError)
      },
    },
  )

  return (
    <Button
      onClick={() => updateNovels({ categoryId })}
      variant="outline"
      size="icon"
    >
      {updateStatus === 'executing' ? (
        <Spinner className="size-6" />
      ) : (
        <RefreshCw className="size-6" />
      )}
      <span className="sr-only">Update category novels</span>
    </Button>
  )
}

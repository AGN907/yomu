'use client'

import { SubmitButton } from '@/components/submit-button'
import { updateNovelsByCategory } from '@/lib/actions/novels'

import { RefreshCw } from '@yomu/ui/components/icons'
import { toast } from '@yomu/ui/components/sonner'

export function UpdateCategoryNovels({ categoryId }: { categoryId: number }) {
  const handleNovelsUpdate = async () => {
    const actionPromise = updateNovelsByCategory(categoryId)

    toast.promise(actionPromise, {
      loading: 'Updating novels...',
      success: (data) => data?.success,
      error: (err) => err.error,
    })
  }

  return (
    <div>
      <form action={handleNovelsUpdate}>
        <SubmitButton variant="outline" size="icon">
          <RefreshCw size={20} />
          <span className="sr-only">Update category novels</span>
        </SubmitButton>
      </form>
    </div>
  )
}

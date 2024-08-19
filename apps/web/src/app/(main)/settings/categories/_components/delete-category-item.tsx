'use client'

import { deleteCategoryAction } from '@/actions/categories'
import { LoadingButton } from '@/components/loading-button'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@yomu/ui/components/alert-dialog'
import { Button } from '@yomu/ui/components/button'
import { Trash } from '@yomu/ui/components/icons'
import { toast } from '@yomu/ui/components/sonner'

import { useState } from 'react'
import { useServerAction } from 'zsa-react'

function DeleteCategoryItem({ categoryId }: { categoryId: number }) {
  const [open, setOpen] = useState(false)

  const { execute, isPending } = useServerAction(deleteCategoryAction, {
    onSuccess() {
      toast.info('Category Deleted', {
        description: 'Category has been deleted',
      })
      setOpen(false)
    },
    onError({ err }) {
      toast.error(err.message)
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="size-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this category?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            loading={isPending}
            onClick={() => execute({ categoryId })}
            variant="destructive"
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteCategoryItem }

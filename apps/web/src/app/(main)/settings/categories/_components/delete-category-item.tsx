'use client'

import { deleteCategory } from '@/lib/actions/categories'

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

import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'

function DeleteCategoryItem({ categoryId }: { categoryId: number }) {
  const [open, setOpen] = useState(false)

  const { execute: deleteCategoryItem, status: deleteStatus } = useAction(
    deleteCategory,
    {
      onSettled(result) {
        const { data } = result
        if (data?.error) {
          toast.error(data.error)
        }
      },
      onSuccess(result) {
        toast.info(result.success)
        setOpen(false)
      },
      onError(error) {
        toast.error(error.serverError || error.fetchError)
      },
    },
  )

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
          <Button
            onClick={() => deleteCategoryItem({ categoryId })}
            variant="destructive"
          >
            {deleteStatus === 'executing' ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteCategoryItem }

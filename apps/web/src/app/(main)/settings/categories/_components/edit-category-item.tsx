'use client'

import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/responsive-dialog'
import { updateCategory } from '@/lib/actions/categories'

import { Category } from '@yomu/core/database/schema/web'
import { Button } from '@yomu/ui/components/button'
import { Pencil } from '@yomu/ui/components/icons'
import { Input } from '@yomu/ui/components/input'
import { toast } from '@yomu/ui/components/sonner'

import { useAction } from 'next-safe-action/hooks'
import { useRef, useState } from 'react'

function EditCategoryItem({
  initialName,
  category,
}: {
  initialName: string
  category: Category
}) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { execute: updateCategoryName, status: updateStatus } = useAction(
    updateCategory,
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
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="size-5" />
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Update category</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody>
          <div className="space-y-4">
            <Input ref={inputRef} defaultValue={initialName} name="name" />
            <Button
              className="w-full"
              onClick={() => {
                const name = inputRef?.current?.value
                if (!name) return

                updateCategoryName({
                  ...category,
                  name: name,
                })
              }}
            >
              {updateStatus === 'executing' ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </ResponsiveDialogBody>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

export { EditCategoryItem }

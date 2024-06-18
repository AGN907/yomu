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
import { createCategory } from '@/lib/actions/categories'

import { Button } from '@yomu/ui/components/button'
import { Input } from '@yomu/ui/components/input'
import { Label } from '@yomu/ui/components/label'
import { toast } from '@yomu/ui/components/sonner'

import { useAction } from 'next-safe-action/hooks'
import { useRef, useState } from 'react'

function CreateNewCategory() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { execute: createNewCategory, status: createStatus } = useAction(
    createCategory,
    {
      onSettled(result) {
        const { data } = result
        if (data?.success) {
          toast.success(data.success)
          setOpen(false)
        } else if (data?.error) {
          toast.error(data.error)
        }
      },
      onError(error) {
        toast.error(error.serverError || error.fetchError)
      },
    },
  )

  return (
    <div>
      <ResponsiveDialog open={open} onOpenChange={setOpen}>
        <ResponsiveDialogTrigger asChild>
          <Button>
            <p>Create category</p>
            <span className="sr-only">Create new category</span>
          </Button>
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Create new category</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody>
            <div className="grid gap-4">
              <Label htmlFor="name">Name</Label>
              <Input ref={inputRef} name="name" type="text" />
              <Button
                onClick={() => {
                  const name = inputRef.current?.value
                  if (!name) return
                  createNewCategory({ name: name })
                }}
              >
                {createStatus === 'executing' ? 'Creating...' : 'Create'}
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
    </div>
  )
}

export { CreateNewCategory }

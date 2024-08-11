'use client'

import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/responsive-dialog'
import { addNovelToLibrary } from '@/lib/actions/novels'
import { capitalize } from '@/lib/utils'

import { Category } from '@yomu/core/database/schema/web'
import { Button } from '@yomu/ui/components/button'
import { Bookmark } from '@yomu/ui/components/icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yomu/ui/components/select'
import { toast } from '@yomu/ui/components/sonner'
import { cn } from '@yomu/ui/utils'

import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'

type ToggleInLibraryProps = {
  novelId: number
  inLibrary: boolean
  categories: Category[]
}

function ToggleInLibrary({
  novelId,
  inLibrary,
  categories,
}: ToggleInLibraryProps) {
  const [open, setOpen] = useState(false)
  const defaultCategory = categories.find(
    (category) => category.default,
  ) as Category

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    defaultCategory.id,
  )

  const { execute: toggleNovelInLibrary, status: addStatus } = useAction(
    addNovelToLibrary,
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
  const isDefaultCategory = categories.length === 1

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          if (inLibrary) {
            toggleNovelInLibrary({ novelId, inLibrary: false })
          } else if (!inLibrary && isDefaultCategory) {
            toggleNovelInLibrary({
              novelId,
              inLibrary: true,
              categoryId: defaultCategory.id,
            })
          } else {
            setOpen(true)
          }
        }}
      >
        <Bookmark
          className={cn(
            'size-6',
            inLibrary ? 'fill-yellow-400 stroke-yellow-500' : '',
          )}
        />
        <span className="sr-only">
          {inLibrary ? 'Remove' : 'Add'} novel from library
        </span>
      </Button>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            Assign novel to category
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody>
          <div className="grid gap-4">
            <Select
              onValueChange={(value) => setSelectedCategoryId(Number(value))}
              defaultValue={`${selectedCategoryId}`}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={`${category.id}`}>
                    {capitalize(category.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() =>
                toggleNovelInLibrary({
                  novelId,
                  inLibrary: true,
                  categoryId: selectedCategoryId,
                })
              }
            >
              {addStatus === 'executing' ? 'Adding...' : 'Add'}
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

export { ToggleInLibrary }

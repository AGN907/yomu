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
import {
  addNovelToLibraryAction,
  removeNovelFromLibraryAction,
} from '@/actions/novels'

import { Category } from '@yomu/core/database/schema/web'
import { capitalize } from '@yomu/core/utils/string'
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

import { useServerAction } from 'zsa-react'
import { useState } from 'react'
import { LoadingButton } from '@/components/loading-button'

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

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >()

  const { execute: addNovelToLibrary, isPending } = useServerAction(
    addNovelToLibraryAction,
    {
      onSuccess() {
        setOpen(false)
        toast.success('Novel Added', {
          description: 'You can now find it in your library',
        })
      },
      onError({ err }) {
        toast.error(err.message)
      },
    },
  )

  const { execute: removeNovelFromLibrary } = useServerAction(
    removeNovelFromLibraryAction,
    {
      onSuccess() {
        toast.success('Novel Removed', {
          description: "Novel won't appear in your library anymore",
        })
      },
    },
  )

  const onlyDefaultCategory = categories.length === 1

  const handleToggle = () => {
    if (!inLibrary && onlyDefaultCategory) {
      addNovelToLibrary({ novelId })
    } else if (inLibrary) {
      removeNovelFromLibrary({ novelId })
    } else {
      setOpen(true)
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="icon" onClick={handleToggle}>
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
            <LoadingButton
              loading={isPending}
              onClick={() =>
                addNovelToLibrary({
                  novelId,
                  categoryId: selectedCategoryId,
                })
              }
            >
              Add
            </LoadingButton>
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

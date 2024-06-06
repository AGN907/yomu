'use client'

import { addNovelToLibrary } from '@/lib/actions/novels'
import { capitalize } from '@/lib/utils'

import { Category } from '@yomu/core/database/schema/web'
import { Button } from '@yomu/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@yomu/ui/components/dialog'
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
import { useEffect, useOptimistic, useState } from 'react'

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [optimisticInLibrary, setOptimisticInLibrary] = useOptimistic(
    inLibrary,
    (state) => !state,
  )

  const { execute, result } = useAction(addNovelToLibrary)
  const isDefaultCategory = categories.length === 1

  useEffect(() => {
    if (result && result.data) {
      if (result.data.error) {
        toast.error(result.data.error)
      } else {
        toast.success(result.data.success)
        setDialogOpen(false)
      }
    }
  }, [result])

  const handleInLibraryToggle = (inLibrary: boolean, categoryId?: number) => {
    setOptimisticInLibrary(inLibrary)

    execute({ novelId, inLibrary, categoryId })
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <form
        action={() => {
          if (inLibrary) {
            handleInLibraryToggle(false)
          } else if (!inLibrary && isDefaultCategory) {
            handleInLibraryToggle(true, 1)
          }
        }}
      >
        <Button
          variant="outline"
          size="icon"
          type={inLibrary || isDefaultCategory ? 'submit' : 'button'}
          onClick={() =>
            !inLibrary && !isDefaultCategory && setDialogOpen(true)
          }
        >
          <Bookmark
            className={cn(
              'size-6',
              optimisticInLibrary ? 'fill-yellow-400 stroke-yellow-500' : '',
            )}
          />
          <span className="sr-only">
            {inLibrary ? 'Remove' : 'Add'} novel from library
          </span>
        </Button>
      </form>
      <DialogContent>
        <AddToLibraryForm
          onAddToLibrary={(formData) => {
            const categoryId = Number(formData.get('categoryId') as string)

            handleInLibraryToggle(true, categoryId)
          }}
          categories={categories}
          confirm={
            <DialogFooter>
              <Button type="submit">Assign</Button>
            </DialogFooter>
          }
        >
          <DialogHeader>
            <DialogTitle>Assign novel to category</DialogTitle>
            <DialogDescription>
              Add novel to a specific category
            </DialogDescription>
          </DialogHeader>
        </AddToLibraryForm>
      </DialogContent>
    </Dialog>
  )
}

type AddToLibraryFormProps = {
  children: React.ReactNode
  onAddToLibrary: (formData: FormData) => void
  categories: Category[]
  confirm: React.ReactNode
}
function AddToLibraryForm(props: AddToLibraryFormProps) {
  const { children, onAddToLibrary, categories, confirm } = props

  return (
    <form action={onAddToLibrary}>
      {children}
      <div className="grid gap-4 py-4">
        <Select name="categoryId" defaultValue="1">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {capitalize(category.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {confirm}
    </form>
  )
}

export { ToggleInLibrary }

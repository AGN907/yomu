'use client'

import { SubmitButton } from '@/components/submit-button'
import { createCategory } from '@/lib/actions/categories'

import { Button } from '@yomu/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yomu/ui/components/dialog'
import { Plus } from '@yomu/ui/components/icons'
import { Input } from '@yomu/ui/components/input'
import { Label } from '@yomu/ui/components/label'

import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'

function CreateNewCategory() {
  const [open, setOpen] = useState(false)
  const { execute, result } = useAction(createCategory)

  useEffect(() => {
    if (result && result.data && result.data.success) {
      setOpen(false)
    }
  }, [result])

  return (
    <div>
      <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
        <DialogTrigger asChild>
          <Button className="rounded-full" size="icon">
            <Plus size={24} />
            <span className="sr-only">Create new category</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form
            action={(formData) => {
              const name = formData.get('name') as string
              execute({ name })
            }}
          >
            <DialogHeader>
              <DialogTitle>Create new category</DialogTitle>
              <DialogDescription>
                Create a category to organize your novels.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4">
              <div className="grid gap-4 py-4">
                <Label htmlFor="name">Name</Label>
                <Input name="name" type="text" />
              </div>
              {result?.validationErrors ? (
                <ul className="bg-destructive/10 text-destructive list-disc space-y-1 rounded-lg border p-2 text-[0.8rem] font-medium">
                  {Object.values(result.validationErrors).map((err, index) => (
                    <li className="ml-4" key={index}>
                      {err}
                    </li>
                  ))}
                </ul>
              ) : result?.data?.error ? (
                <p className="bg-destructive/10 text-destructive rounded-lg border p-2 text-[0.8rem] font-medium">
                  {result.data.error}
                </p>
              ) : null}
            </div>
            <DialogFooter>
              <SubmitButton>Create</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { CreateNewCategory }

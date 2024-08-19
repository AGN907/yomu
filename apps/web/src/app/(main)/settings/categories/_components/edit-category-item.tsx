'use client'

import { updateCategoryNameAction } from '@/actions/categories'
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
import {
  UpdateCategoryNameSchema,
  type UpdateCategoryNameInput,
} from '@/lib/validators/categories'
import { LoadingButton } from '@/components/loading-button'

import { Category } from '@yomu/core/database/schema/web'
import { Button } from '@yomu/ui/components/button'
import { Pencil } from '@yomu/ui/components/icons'
import { Input } from '@yomu/ui/components/input'
import { toast } from '@yomu/ui/components/sonner'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@yomu/ui/components/form'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerAction } from 'zsa-react'

function EditCategoryItem({
  initialName,
  category,
}: {
  initialName: string
  category: Category
}) {
  const [open, setOpen] = useState(false)
  const form = useForm<UpdateCategoryNameInput>({
    resolver: zodResolver(UpdateCategoryNameSchema),
    defaultValues: {
      name: initialName,
      categoryId: category.id,
    },
  })

  const { execute, isPending } = useServerAction(updateCategoryNameAction, {
    onSuccess() {
      toast.success('Category Updated', {
        description: 'Category name has been updated.',
      })
      setOpen(false)
    },
    onError({ err }) {
      toast.error(err.message)
    },
  })

  const onSubmit = (data: UpdateCategoryNameInput) => {
    const { categoryId, name } = data

    execute({ categoryId, name })
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton className="w-full" loading={isPending}>
                Update
              </LoadingButton>
            </form>
          </Form>
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

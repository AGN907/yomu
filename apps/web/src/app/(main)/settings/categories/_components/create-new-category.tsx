'use client'

import { createCategoryAction } from '@/actions/categories'
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
  CreateCategorySchema,
  type CreateCategoryInput,
} from '@/lib/validators/categories'
import { LoadingButton } from '@/components/loading-button'

import { Button } from '@yomu/ui/components/button'
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

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerAction } from 'zsa-react'

function CreateNewCategory() {
  const [open, setOpen] = useState(false)
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
    },
  })

  const { execute, isPending } = useServerAction(createCategoryAction, {
    onSuccess() {
      toast.success('Category Created', {
        description: 'Category has been created. You can add novels to it.',
      })
      setOpen(false)
    },
    onError({ err }) {
      toast.error(err.message)
    },
  })

  const onSubmit = (data: CreateCategoryInput) => {
    const { name } = data

    form.reset()
    execute({ name })
  }

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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="on-hold" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <LoadingButton loading={isPending}>Create</LoadingButton>
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
    </div>
  )
}

export { CreateNewCategory }

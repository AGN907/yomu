'use client'

import { updateUsernameAction } from '@/actions/users'
import { LoadingButton } from '@/components/loading-button'
import { CardContainer } from '@/components/card-container'
import {
  type UpdateUsernameInput,
  UpdateUsernameSchema,
} from '@/lib/validators/users'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@yomu/ui/components/form'
import { Input } from '@yomu/ui/components/input'
import { toast } from '@yomu/ui/components/sonner'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerAction } from 'zsa-react'

type UsernameFormCardProps = {
  defaultUsername: string
}

function UsernameFormCard({ defaultUsername }: UsernameFormCardProps) {
  const form = useForm<UpdateUsernameInput>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: {
      username: defaultUsername,
    },
  })

  const { execute, isPending } = useServerAction(updateUsernameAction, {
    onSuccess() {
      toast.success('Username Update', {
        description: 'Your username was updated successfully',
      })
    },
    onError({ err }) {
      toast.error(err.message)
    },
  })

  const onSubmit = (data: UpdateUsernameInput) => {
    const { username } = data
    if (username === defaultUsername) {
      toast.error("Username can't be the same as the current one")
      return
    }

    execute({ username })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContainer
          title={'Update username'}
          description={'Change your username'}
          footer={<LoadingButton loading={isPending}>Save</LoadingButton>}
        >
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContainer>
      </form>
    </Form>
  )
}

export { UsernameFormCard }

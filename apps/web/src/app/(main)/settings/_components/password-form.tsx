'use client'

import { updatePasswordAction } from '@/actions/users'
import { CardContainer } from '@/components/card-container'
import { PasswordInput } from '@/components/password-input'
import { SubmitButton } from '@/components/submit-button'
import {
  type UpdatePasswordInput,
  UpdatePasswordSchema,
} from '@/lib/validators/users'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@yomu/ui/components/form'
import { toast } from '@yomu/ui/components/sonner'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useServerAction } from 'zsa-react'

function PasswordFormCard() {
  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  })

  const { execute } = useServerAction(updatePasswordAction, {
    onSuccess() {
      toast.success('Password Updated', {
        description: 'Your password was updated successfully',
      })
    },
    onError({ err }) {
      toast.error(err.message)
    },
  })

  const onSubmit = (data: UpdatePasswordInput) => {
    const { currentPassword, newPassword } = data

    execute({ currentPassword, newPassword })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CardContainer
          title="Update password"
          description="Change your password"
          footer={<SubmitButton>Save</SubmitButton>}
        >
          <div className="grid gap-y-4">
            <FormField
              name="currentPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContainer>
      </form>
    </Form>
  )
}

export { PasswordFormCard }

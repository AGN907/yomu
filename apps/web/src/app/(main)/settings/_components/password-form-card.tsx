'use client'

import { updatePasswordAction } from '@/actions/users'
import { CardContainer } from '@/components/card-container'
import { PasswordInput } from '@/components/password-input'
import { SubmitButton } from '@/components/submit-button'

import { Label } from '@yomu/ui/components/label'
import { toast } from '@yomu/ui/components/sonner'

import { useRef } from 'react'
import { useServerAction } from 'zsa-react'

function PasswordFormCard() {
  const formRef = useRef<HTMLFormElement>(null)
  const { execute, error } = useServerAction(updatePasswordAction, {
    onSuccess() {
      toast.success('Password Updated', {
        description: 'Your password was updated successfully',
      })
    },
    onError({ err }) {
      toast.error(err.message)
    },
  })

  return (
    <form
      ref={formRef}
      action={(formData) => {
        const currentPassword = formData.get('current-password') as string
        const newPassword = formData.get('new-password') as string

        execute({ currentPassword, newPassword })
        formRef.current?.reset()
      }}
      className="space-y-8"
    >
      <CardContainer
        title="Update password"
        description="Change your password"
        footer={<SubmitButton>Save</SubmitButton>}
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <PasswordInput
              name="current-password"
              id="current-password"
              placeholder="Your current password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <PasswordInput
              name="new-password"
              id="new-password"
              placeholder="Your new password"
              required
            />
          </div>
          {error ? <span>{error.message}</span> : null}
        </div>
      </CardContainer>
    </form>
  )
}

export { PasswordFormCard }

'use client'
import { CardContainer } from '@/components/card-container'
import { FormErrorsField } from '@/components/form-errors-field'
import { PasswordInput } from '@/components/password-input'
import { SubmitButton } from '@/components/submit-button'
import { updatePassword } from '@/lib/actions/auth'

import { Label } from '@yomu/ui/components/label'
import { toast } from '@yomu/ui/components/sonner'

import { useAction } from 'next-safe-action/hooks'
import { useRef } from 'react'

function PasswordFormCard() {
  const formRef = useRef<HTMLFormElement>(null)
  const { execute: updatePass, result } = useAction(updatePassword, {
    onSuccess(result) {
      toast.error(result.success)
    },
  })

  return (
    <form
      ref={formRef}
      action={(formData) => {
        const currentPassword = formData.get('current-password') as string
        const newPassword = formData.get('new-password') as string

        updatePass({ currentPassword, newPassword })
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
          <FormErrorsField result={result} />
        </div>
      </CardContainer>
    </form>
  )
}

export { PasswordFormCard }

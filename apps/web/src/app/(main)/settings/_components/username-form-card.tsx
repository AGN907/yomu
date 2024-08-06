'use client'

import { updateUsername } from '@/actions/auth'
import { CardContainer } from '@/components/card-container'
import { FormErrorsField } from '@/components/form-errors-field'
import { SubmitButton } from '@/components/submit-button'

import { Input } from '@yomu/ui/components/input'
import { Label } from '@yomu/ui/components/label'
import { toast } from '@yomu/ui/components/sonner'

import { useAction } from 'next-safe-action/hooks'

type UsernameFormCardProps = {
  username: string
}

function UsernameFormCard({ username }: UsernameFormCardProps) {
  const { execute: updateUser, result } = useAction(updateUsername, {
    onSuccess(result) {
      if (result.success) {
        toast.success(result.success, {
          id: 'update-username',
        })
      }
    },
  })

  return (
    <form
      action={(formData) => {
        const newUsername = formData.get('username') as string
        if (newUsername === username) {
          toast.error('New username must be different from old one')
          return
        }

        updateUser({ username: newUsername })
      }}
    >
      <CardContainer
        title={'Update username'}
        description={'Change your username'}
        footer={<SubmitButton>Save</SubmitButton>}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Your username"
              defaultValue={username}
              required
            />
          </div>
          <FormErrorsField result={result} />
        </div>
      </CardContainer>
    </form>
  )
}

export { UsernameFormCard }

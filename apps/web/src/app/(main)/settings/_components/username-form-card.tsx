'use client'

import { updateUsernameAction } from '@/actions/users'
import { CardContainer } from '@/components/card-container'
import { SubmitButton } from '@/components/submit-button'

import { Input } from '@yomu/ui/components/input'
import { Label } from '@yomu/ui/components/label'
import { toast } from '@yomu/ui/components/sonner'

import { useServerAction } from 'zsa-react'

type UsernameFormCardProps = {
  username: string
}

function UsernameFormCard({ username }: UsernameFormCardProps) {
  const { execute: updateUser } = useServerAction(updateUsernameAction, {
    onSuccess() {
      toast.success('Username Update', {
        description: 'Your username was updated successfully',
      })
    },
    onError({ err }) {
      toast.error(err.message)
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
        </div>
      </CardContainer>
    </form>
  )
}

export { UsernameFormCard }

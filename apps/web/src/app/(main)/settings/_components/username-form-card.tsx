'use client'
import { CardContainer } from '@/components/card-container'
import { FormErrorsField } from '@/components/form-errors-field'
import { SubmitButton } from '@/components/submit-button'
import { updateUsername } from '@/lib/actions/auth'

import { Input } from '@yomu/ui/components/input'
import { Label } from '@yomu/ui/components/label'
import { toast } from '@yomu/ui/components/sonner'

import { useAction } from 'next-safe-action/hooks'
import { useEffect } from 'react'

type UsernameFormCardProps = {
  username: string
}

function UsernameFormCard({ username }: UsernameFormCardProps) {
  const { execute, result } = useAction(updateUsername)

  const handleSubmit = (formData: FormData) => {
    const username = formData.get('username') as string

    execute({ username })
  }

  useEffect(() => {
    if (result && result.data && result.data.success) {
      toast.success(result.data.success)
    }
  })

  return (
    <form action={handleSubmit}>
      <CardContainer
        title={'Update username'}
        description={'Change your username'}
        footer={<SubmitButton>Save</SubmitButton>}
      >
        <div className="grid grid-cols-1 gap-4">
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

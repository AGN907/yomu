'use client'

import { FormErrorsField } from '@/components/form-errors-field'
import { PasswordInput } from '@/components/password-input'
import { SubmitButton } from '@/components/submit-button'
import { signup } from '@/lib/actions/auth'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yomu/ui/components/card'
import { Input } from '@yomu/ui/components/input'
import { Label } from '@yomu/ui/components/label'

import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'

function SignupForm() {
  const { execute, result } = useAction(signup)

  const handleSignup = (formData: FormData) => {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    execute({ username, password })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="John"
              name="username"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <PasswordInput id="password" name="password" required />
          </div>
          <FormErrorsField result={result} />
          <SubmitButton type="submit" className="w-full">
            Sign up
          </SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link className="text-sm hover:underline" href="/log-in">
          Already have an account? Log in
        </Link>
      </CardFooter>
    </Card>
  )
}

export { SignupForm }

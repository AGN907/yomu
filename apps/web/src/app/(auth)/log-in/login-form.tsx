'use client'

import { FormErrorsField } from '@/components/form-errors-field'
import { PasswordInput } from '@/components/password-input'
import { SubmitButton } from '@/components/submit-button'
import { login } from '@/lib/actions/auth'

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

function LoginForm() {
  const { execute, result } = useAction(login)

  const handleLogin = (formData: FormData) => {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    execute({ username, password })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleLogin} className="grid gap-4">
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
            Login
          </SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link className="text-sm hover:underline" href="/sign-up">
          New to Yomu? Create an account
        </Link>
      </CardFooter>
    </Card>
  )
}

export { LoginForm }

'use client'

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={(formData) => {
            const username = formData.get('username') as string
            const password = formData.get('password') as string

            execute({ username, password })
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="TheSleepyCat"
              pattern="^[a-zA-Z0-9_-]{4,31}$"
              name="username"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" name="password" required />
          </div>
          {result?.validationErrors ? (
            <ul className="bg-destructive/10 text-destructive list-disc space-y-1 rounded-lg border p-2 text-[0.8rem] font-medium">
              {Object.values(result.validationErrors).map((err, index) => (
                <li className="ml-4" key={index}>
                  {err}
                </li>
              ))}
            </ul>
          ) : result?.data?.failure ? (
            <p className="bg-destructive/10 text-destructive rounded-lg border p-2 text-[0.8rem] font-medium">
              {result.data.failure}
            </p>
          ) : null}
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

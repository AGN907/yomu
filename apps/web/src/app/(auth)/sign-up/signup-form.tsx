'use client'

import { registerUserAction } from '@/actions/users'
import { PasswordInput } from '@/components/password-input'
import {
  RegisterUserSchema,
  type RegisterUserInput,
} from '@/lib/validators/users'
import { LoadingButton } from '@/components/loading-button'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yomu/ui/components/card'
import { Input } from '@yomu/ui/components/input'
import { Alert, AlertDescription, AlertTitle } from '@yomu/ui/components/alert'
import { toast } from '@yomu/ui/components/sonner'
import {
  Form,
  FormItem,
  FormControl,
  FormField,
  FormMessage,
  FormLabel,
} from '@yomu/ui/components/form'
import { Terminal } from '@yomu/ui/components/icons'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useServerAction } from 'zsa-react'

function SignupForm() {
  const form = useForm<RegisterUserInput>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const { execute, isPending, error } = useServerAction(registerUserAction, {
    onError({ err }) {
      toast.error('Registration failed', {
        description: err.message,
      })
    },
  })

  const onSubmit = (data: RegisterUserInput) => {
    const { username, password } = data
    execute({ username, password })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? (
              <Alert variant="destructive">
                <Terminal className="size-4" />
                <AlertTitle>Registration failed</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            ) : null}
            <LoadingButton loading={isPending} type="submit" className="w-full">
              Sign up
            </LoadingButton>
          </form>
        </Form>
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

'use client'

import { loginAction } from '@/actions/users'
import { PasswordInput } from '@/components/password-input'
import { LoadingButton } from '@/components/loading-button'
import { type LoginInput, LoginSchema } from '@/lib/validators/users'

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

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useServerAction } from 'zsa-react'

function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const { execute, isPending, error } = useServerAction(loginAction, {
    onError({ err }) {
      toast.error('Login failed', {
        description: err.message,
      })
    },
  })

  const onSubmit = (data: LoginInput) => {
    const { username, password } = data

    execute({ username, password })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Login to your account</CardDescription>
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
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            ) : null}
            <LoadingButton loading={isPending} type="submit" className="w-full">
              Login
            </LoadingButton>
          </form>{' '}
        </Form>
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

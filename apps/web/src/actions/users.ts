'use server'

import { lucia, validateRequest } from '@/lib/auth'
import { authenticatedAction, publicAction } from '@/lib/safe-action'
import {
  LoginSchema,
  RegisterUserSchema,
  UpdatePasswordSchema,
  UpdateUsernameSchema,
} from '@/lib/validators/users'
import {
  loginUseCase,
  registerUserUseCase,
  updatePasswordUseCase,
  updateUsernameUseCase,
} from '@/use-cases/users'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const registerUserAction = publicAction
  .input(RegisterUserSchema)
  .handler(async ({ input }) => {
    const { username, password } = input

    const user = await registerUserUseCase(username, password)

    if (user) {
      redirect('/')
    }
  })

export const loginAction = publicAction
  .input(LoginSchema)
  .handler(async ({ input }) => {
    const { username, password } = input

    const user = await loginUseCase(username, password)

    if (user) {
      redirect('/')
    }
  })

export const logoutAction = async () => {
  const { session } = await validateRequest()

  if (!session) {
    redirect('/log-in')
  }

  await lucia.invalidateSession(session.id)
  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  redirect('/log-in')
}

export const updateUsernameAction = authenticatedAction
  .input(UpdateUsernameSchema)
  .handler(async ({ input, ctx }) => {
    const { username } = input
    const { user } = ctx

    await updateUsernameUseCase(user, username)

    revalidatePath('/')
    revalidatePath('/settings')
  })

export const updatePasswordAction = authenticatedAction
  .input(UpdatePasswordSchema)
  .handler(async ({ input, ctx }) => {
    const { currentPassword, newPassword } = input
    const { user } = ctx

    await updatePasswordUseCase(user, {
      currentPassword,
      newPassword,
    })
  })

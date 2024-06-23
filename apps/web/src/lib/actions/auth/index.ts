'use server'

import { lucia } from '@/lib/auth'
import { validateRequest } from '@/lib/auth/validate-request'
import { db, eq } from '@/lib/database'
import { action, authAction } from '@/lib/safe-action'
import {
  UpdatePasswordSchema,
  UpdateUsernameSchema,
  loginSchema,
  signupSchema,
} from '@/lib/validators/auth'
import { createDefaultCategory } from '../categories'

import { users } from '@yomu/core/database/schema/web'

import { hash, verify } from '@node-rs/argon2'
import { generateIdFromEntropySize } from 'lucia'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signup = action(signupSchema, async ({ username, password }) => {
  try {
    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    const userId = generateIdFromEntropySize(10)

    const existingUser = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.username, username),
    })

    if (existingUser)
      return {
        error: 'Invalid username',
      }

    await db.transaction(async (tx) => {
      const [{ id }] = await tx
        .insert(users)
        .values({
          id: userId,
          username,
          hashedPassword,
        })
        .returning({ id: users.id })

      const createdDefaultCategory = await createDefaultCategory(id)

      if (!createdDefaultCategory) {
        tx.rollback()
        return {
          error: 'Something went wrong, please try again',
        }
      }
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )
  } catch (error) {
    console.error(error)
    return {
      error: 'Something went wrong, please try again',
    }
  }
  redirect('/')
})

export const login = action(loginSchema, async ({ username, password }) => {
  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.username, username),
  })

  if (!existingUser)
    return {
      error: 'Invalid username or password',
    }

  const validPassword = await verify(existingUser.hashedPassword, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  if (!validPassword)
    return {
      error: 'Invalid username or password',
    }

  const session = await lucia.createSession(existingUser.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return redirect('/')
})

export const logout = async () => {
  const { session } = await validateRequest()
  if (!session) {
    return {
      error: 'Unauthorized',
    }
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return redirect('/log-in')
}

export const getUserOrRedirect = async () => {
  const { user } = await validateRequest()
  if (!user) {
    redirect('/log-in')
  }

  return user
}

export const updateUsername = authAction(
  UpdateUsernameSchema,
  async ({ username }, { userId }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: (table, { and, not, eq }) =>
          and(not(eq(table.id, userId)), eq(table.username, username)),
      })

      if (existingUser)
        return {
          error: 'This username is already taken',
        }

      await db
        .update(users)
        .set({ username: username })
        .where(eq(users.id, userId))

      revalidatePath('/')
      revalidatePath('/settings')

      return {
        success: 'Username updated successfully',
      }
    } catch (error) {
      console.error(error)
      return {
        error: 'Something went wrong, please try again',
      }
    }
  },
)

export const updatePassword = authAction(
  UpdatePasswordSchema,
  async ({ currentPassword, newPassword }, { userId }) => {
    try {
      const currentUser = await db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, userId),
        columns: {
          hashedPassword: true,
        },
      })

      if (!currentUser) {
        redirect('/log-in')
      }

      const validPassword = await verify(
        currentUser.hashedPassword,
        currentPassword,
        {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        },
      )

      if (!validPassword)
        return {
          error: 'Invalid current password',
        }

      const hashedPassword = await hash(newPassword, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      })

      await db.update(users).set({ hashedPassword }).where(eq(users.id, userId))

      return {
        success: 'Password updated successfully',
      }
    } catch (error) {
      console.error(error)
      return {
        error: 'Something went wrong, please try again',
      }
    }
  },
)

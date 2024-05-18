'use server'

import { db } from '@/lib/database'
import { action } from '@/lib/safe-action'
import { loginSchema, signupSchema } from '@/lib/validators/auth'

import { lucia } from '@/lib/auth'
import { validateRequest } from '@/lib/auth/validate-request'

import { hash, verify } from '@node-rs/argon2'
import { generateIdFromEntropySize } from 'lucia'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { users } from '@yomu/core/database/schema/web'

export const signup = action(signupSchema, async ({ username, password }) => {
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

  if (!existingUser)
    return {
      failure: 'Invaild username',
    }

  await db.insert(users).values({
    id: userId,
    username: username,
    hashedPassword: hashedPassword,
  })

  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  redirect('/')
})

export const login = action(loginSchema, async ({ username, password }) => {
  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.username, username),
  })

  if (!existingUser)
    return {
      failure: 'Invalid username or password',
    }

  const validPassword = await verify(existingUser.hashedPassword, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  if (!validPassword)
    return {
      failure: 'Invalid username or password',
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

  return redirect('/login')
}

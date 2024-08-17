import { db } from '@/lib/database'

import { sessions, users } from '@yomu/core/database/schema/web'

import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { hash } from '@node-rs/argon2'
import {
  Lucia,
  generateIdFromEntropySize,
  type Session,
  type User,
} from 'lucia'
import { cookies } from 'next/headers'

const adapter = new DrizzleSQLiteAdapter(db, sessions, users)

const SECURE_COOKIE = process.env.SECURE_COOKIE === 'true'

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: SECURE_COOKIE,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    }
  },
})

export const validateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
  if (!sessionId) {
    return {
      user: null,
      session: null,
    }
  }

  const result = await lucia.validateSession(sessionId)
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
  } catch {
    // do nothing
  }
  return result
}

export async function hashPassword(password: string) {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })
}

export function generateId() {
  return generateIdFromEntropySize(10)
}

interface DatabaseUserAttributes {
  username: string
}

declare module 'lucia' {
  export interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

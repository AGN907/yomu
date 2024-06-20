import { db } from '@/lib/database'

import { sessions, users } from '@yomu/core/database/schema/web'

import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { Lucia } from 'lucia'

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
      fullName: `${attributes.firstName} ${attributes.lastName}`,
    }
  },
})

interface DatabaseUserAttributes {
  username: string
  firstName: string
  lastName: string
}

declare module 'lucia' {
  export interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

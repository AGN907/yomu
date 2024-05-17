import { db } from '@/lib/database'

import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { sessions, users } from '@yomu/core/database/schema/web'
import { Lucia } from 'lucia'

// @ts-expect-error - Both drizzle and lucia have separate delclarations of private properties
const adapter = new DrizzleSQLiteAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
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

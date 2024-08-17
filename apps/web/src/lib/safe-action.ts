import { validateRequest } from './auth/validate-request'
import { AuthenticationError, PublicError } from './errors'

import { createSafeActionClient, DEFAULT_SERVER_ERROR } from 'next-safe-action'

export type UserSession = {
  userId: string
}

export const action = createSafeActionClient({
  handleReturnedServerError(error) {
    if (error instanceof PublicError) {
      return error.message
    }
    return DEFAULT_SERVER_ERROR
  },
})

export const authAction = createSafeActionClient({
  async middleware() {
    const { user } = await validateRequest()

    if (!user) {
      throw new AuthenticationError()
    }

    return { userId: user.id }
  },
})

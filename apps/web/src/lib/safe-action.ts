import { createSafeActionClient } from 'next-safe-action'
import { validateRequest } from './auth/validate-request'

export class MyError extends Error {}

export const action = createSafeActionClient({
  handleReturnedServerError(error) {
    if (error instanceof MyError) {
      return error.message
    }

    return 'Something went wrong. Please try again later.'
  },
})

export const authAction = createSafeActionClient({
  middleware: async () => {
    const { user } = await validateRequest()

    if (!user) {
      throw new MyError('Session not found')
    }

    return { userId: user.id }
  },
})

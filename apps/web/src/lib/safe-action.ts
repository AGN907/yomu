import { createSafeActionClient } from 'next-safe-action'
import { validateRequest } from './auth/validate-request'

export const action = createSafeActionClient()

export const authAction = createSafeActionClient({
  async middleware() {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error('Unauthorized')
    }

    return { userId: user.id }
  },
})

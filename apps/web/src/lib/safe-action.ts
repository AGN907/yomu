import { createSafeActionClient } from 'next-safe-action'
import { redirect } from 'next/navigation'
import { validateRequest } from './auth/validate-request'

export const action = createSafeActionClient()

export const authAction = createSafeActionClient({
  async middleware() {
    const { user } = await validateRequest()

    if (!user) {
      redirect('/login')
    }

    return { userId: user.id }
  },
})

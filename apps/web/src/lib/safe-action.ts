import { getUserOrRedirect } from './actions/auth'

import { createSafeActionClient } from 'next-safe-action'

export const action = createSafeActionClient()

export const actionWithAuth = createSafeActionClient({
  async middleware() {
    const user = await getUserOrRedirect()

    return { userId: user.id }
  },
})

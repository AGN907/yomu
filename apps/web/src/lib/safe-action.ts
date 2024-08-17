import { assertAuthenticated } from './session'

import { createServerActionProcedure } from 'zsa'

export type UserSession = {
  id: string
  username: string
  fullName: string
}

export const publicAction = createServerActionProcedure()
  .handler(async () => {})
  .createServerAction()

export const authenticatedAction = createServerActionProcedure()
  .handler(async () => {
    const user = await assertAuthenticated()

    return { user }
  })
  .createServerAction()

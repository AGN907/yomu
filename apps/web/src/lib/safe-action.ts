import { PublicError } from './errors'
import { assertAuthenticated } from './session'

import { createServerActionProcedure } from 'zsa'

export type UserSession = {
  id: string
  username: string
}

function shapeErrors({ err }: any) {
  const isAllowedError = err instanceof PublicError
  const isDev = process.env.NODE_ENV === 'development'
  if (isAllowedError || isDev) {
    console.error(err)
    return {
      code: err.code ?? 'ERROR',
      message: `${!isAllowedError && isDev ? '' : ''}${err.message}`,
    }
  } else {
    return {
      code: 'ERROR',
      message: 'Something went wrong',
    }
  }
}

export const publicAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async (props) => {
    console.log(props.responseMeta?.statusCode)
  })
  .createServerAction()

export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const user = await assertAuthenticated()

    return { user }
  })
  .createServerAction()

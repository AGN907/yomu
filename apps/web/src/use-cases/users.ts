import { countUserCategories } from '@/data-access/categories'
import { countReadChapters, countUnreadChapters } from '@/data-access/chapters'
import { countLibraryNovels } from '@/data-access/novels'
import {
  createUser,
  getUserByUsername,
  isUsernameTaken,
  updateUser,
  verifyPassword,
} from '@/data-access/users'
import { generateId, hashPassword } from '@/lib/auth'
import { AuthenticationError, PublicError } from '@/lib/errors'
import { UserSession } from '@/lib/safe-action'
import { setSession } from '@/lib/session'

export async function registerUserUseCase(username: string, password: string) {
  const existingUser = await getUserByUsername(username)
  if (existingUser) {
    throw new PublicError('An user with that username already exists')
  }

  const id = generateId()
  const hashedPassword = await hashPassword(password)
  const user = await createUser({
    id,
    username,
    hashedPassword,
  })

  setSession(user.id)

  return { id: user.id, username: user.username }
}

export async function loginUseCase(username: string, password: string) {
  const user = await getUserByUsername(username)

  if (!user) {
    throw new PublicError('Invalid username or password')
  }

  const isPasswordValid = await verifyPassword(username, password)
  if (!isPasswordValid) {
    throw new PublicError('Invalid username or password')
  }

  setSession(user.id)
  return { id: user.id }
}

export async function updateUsernameUseCase(
  user: UserSession,
  username: string,
) {
  const usernameTaken = await isUsernameTaken(user.id, username)
  if (usernameTaken) {
    throw new PublicError('An user with that username already exists')
  }

  await updateUser(user.id, { username })
}

export async function updatePasswordUseCase(
  user: UserSession,
  {
    currentPassword,
    newPassword,
  }: {
    currentPassword: string
    newPassword: string
  },
) {
  const userExist = await getUserByUsername(user.username)
  if (!userExist) {
    throw new AuthenticationError()
  }

  const isPasswordValid = await verifyPassword(
    userExist.hashedPassword,
    currentPassword,
  )
  if (!isPasswordValid) {
    throw new PublicError('Invalid password')
  }

  const hashedPassword = await hashPassword(newPassword)
  await updateUser(user.id, { hashedPassword })
}

export async function getUserStatsUseCase(user: UserSession) {
  const [
    totalLibraryNovels,
    totalReadChapters,
    totalUnreadChapters,
    totalCategories,
  ] = await Promise.all([
    countLibraryNovels(user.id),
    countReadChapters(user.id),
    countUnreadChapters(user.id),
    countUserCategories(user.id),
  ])

  return {
    totalLibraryNovels,
    totalReadChapters,
    totalUnreadChapters,
    totalCategories,
  }
}

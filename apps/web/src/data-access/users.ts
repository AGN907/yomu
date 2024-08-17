import { and, db, eq, not } from '@/lib/database'

import { users, type NewUser } from '@yomu/core/database/schema/web'

import { verify } from '@node-rs/argon2'

export async function createUser(newUser: NewUser) {
  const [user] = await db.insert(users).values(newUser).returning()

  return user
}

export async function getUserById(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  })
}

export async function getUserByUsername(username: string) {
  return await db.query.users.findFirst({
    where: eq(users.username, username),
  })
}

export async function updateUser(
  userId: string,
  updatedUser: Partial<NewUser>,
) {
  const [user] = await db
    .update(users)
    .set(updatedUser)
    .where(eq(users.id, userId))
    .returning()

  return user
}

export async function isUsernameTaken(userId: string, username: string) {
  return await db.query.users
    .findFirst({
      where: and(not(eq(users.id, userId)), eq(users.username, username)),
    })
    .then((user) => !!user)
}

export async function verifyPassword(username: string, plainPassword: string) {
  const user = await getUserByUsername(username)
  if (!user) {
    return false
  }

  return verify(user.hashedPassword, plainPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })
}

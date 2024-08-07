'use server'

import { and, count, db, eq } from '@/lib/database'
import { getUserOrRedirect } from './auth'
import { getCategories } from './categories'

import { chapters, novels } from '@yomu/core/database/schema/web'

export const getUserStats = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  const [
    numberOfLibraryNovels,
    numberOfCompletedChapters,
    numberOfUnreadChapters,
  ] = await Promise.all([
    getNumberOfLibraryNovels(userId),
    getNumberOfCompletedChapters(userId),
    getNumberOfUnreadChapters(userId),
  ])

  const allCategories = await getCategories()
  const numberOfCategories = allCategories.length

  return {
    numberOfLibraryNovels,
    numberOfCompletedChapters,
    numberOfUnreadChapters,
    numberOfCategories,
  }
}

export const getNumberOfLibraryNovels = async (userId: string) => {
  const [{ numberOfLibraryNovels }] = await db
    .select({
      numberOfLibraryNovels: count(novels.id),
    })
    .from(novels)
    .where(and(eq(novels.userId, userId), eq(novels.inLibrary, true)))

  return numberOfLibraryNovels
}

export const getNumberOfCompletedChapters = async (userId: string) => {
  const [{ numberOfCompletedChapters }] = await db
    .select({
      numberOfCompletedChapters: count(chapters.id),
    })
    .from(chapters)
    .innerJoin(novels, eq(chapters.novelId, novels.id))
    .where(
      and(
        eq(novels.userId, userId),
        eq(novels.inLibrary, true),
        eq(chapters.read, true),
      ),
    )

  return numberOfCompletedChapters
}

export const getNumberOfUnreadChapters = async (userId: string) => {
  const [{ numberOfUnreadChapters }] = await db
    .select({
      numberOfUnreadChapters: count(chapters.id),
    })
    .from(chapters)
    .innerJoin(novels, eq(chapters.novelId, novels.id))
    .where(
      and(
        eq(novels.userId, userId),
        eq(novels.inLibrary, true),
        eq(chapters.read, false),
      ),
    )

  return numberOfUnreadChapters
}

export const getGenresStats = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  const genres = await db
    .select({ genres: novels.genres })
    .from(novels)
    .where(and(eq(novels.userId, userId), eq(novels.inLibrary, true)))

  const allGenres = genres.map((genres) => genres.genres).flat()

  return allGenres
    .reduce(
      (acc, genre) => {
        if (!acc.find((g) => g.name === genre)) {
          acc.push({ name: genre, value: 1 })
        } else {
          return acc.map((g) =>
            g.name === genre ? { ...g, value: g.value + 1 } : g,
          )
        }
        return acc
      },
      [] as { name: string; value: number }[],
    )
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
}

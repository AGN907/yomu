'use server'

import { and, count, db, eq } from '@/lib/database'
import { getUserOrRedirect } from './auth'
import { getCategories } from './categories'

import { chapters, novels } from '@yomu/core/database/schema/web'

export const getUserStats = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  const novelCountQuery = await getTotalLibraryNovels(userId)
  const completedChapterCountQuery = await getCompletedChapters(userId)
  const unreadChapterCountQuery = await getUnreadChapters(userId)

  const allCategories = await getCategories()
  const totalCategoryCount = allCategories.length

  return [
    novelCountQuery[0].value || 0,
    completedChapterCountQuery[0].value || 0,
    unreadChapterCountQuery[0].value || 0,
    totalCategoryCount,
  ]
}

export const getTotalLibraryNovels = async (userId: string) => {
  return await db
    .select({
      value: count(novels.id),
    })
    .from(novels)
    .where(and(eq(novels.userId, userId), eq(novels.inLibrary, true)))
}

export const getCompletedChapters = async (userId: string) => {
  return await db
    .select({
      value: count(chapters.id),
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
}

export const getUnreadChapters = async (userId: string) => {
  return await db
    .select({
      value: count(chapters.id),
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

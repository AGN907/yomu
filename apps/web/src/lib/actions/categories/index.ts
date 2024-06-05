'use server'

import { db } from '@/lib/database'
import { authAction } from '@/lib/safe-action'
import { CreateNewCategoryScehma } from '@/lib/validators/categories'
import { getUserOrRedirect } from '../auth'

import { categories } from '@yomu/core/database/schema/web'

import { revalidatePath } from 'next/cache'

export const getCategories = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  const categories = await db.query.categories.findMany({
    where: (table, { eq }) => eq(table.userId, userId),
  })

  return categories
}

export const createCategory = authAction(
  CreateNewCategoryScehma,
  async ({ name }, { userId }) => {
    const categoryExist = await db.query.categories.findFirst({
      where: (table, { and, eq }) =>
        and(eq(table.userId, userId), eq(table.name, name)),
    })

    if (categoryExist) {
      return {
        error: 'Category already exists',
      }
    }

    try {
      await db.insert(categories).values({
        name: name.trim().toLowerCase(),
        userId,
      })

      revalidatePath('/library')

      return {
        success: 'Category created',
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: "Couldn't create category. Please try again",
        }
      }
    }
  },
)

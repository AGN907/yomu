'use server'

import { and, db, eq } from '@/lib/database'
import { authAction } from '@/lib/safe-action'
import { CreateNewCategoryScehma } from '@/lib/validators/categories'
import { getUserOrRedirect } from '../auth'

import { Category, categories } from '@yomu/core/database/schema/web'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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
    try {
      const categoryExist = await db.query.categories.findFirst({
        where: (table, { and, eq }) =>
          and(eq(table.userId, userId), eq(table.name, name)),
      })

      if (categoryExist) {
        return {
          error: 'Category already exists',
        }
      }

      await db.insert(categories).values({
        name: name.trim().toLowerCase(),
        userId,
      })

      revalidatePath('/library')

      return {
        success: 'Category created',
      }
    } catch (error) {
      console.error(error)
      return {
        error: "Couldn't create category. Please try again",
      }
    }
  },
)

export const createDefaultCategory = async (userId: string) => {
  try {
    const categoryExist = await db.query.categories.findFirst({
      where: (table, { and, eq }) =>
        and(eq(table.userId, userId), eq(table.name, 'default')),
    })

    if (categoryExist) {
      return true
    }

    await db.insert(categories).values({
      name: 'default',
      userId,
    })

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const updateCategory = authAction(
  z.custom<Category>(),
  async ({ ...category }, { userId }) => {
    try {
      await db
        .update(categories)
        .set({ ...category })
        .where(
          and(eq(categories.userId, userId), eq(categories.id, category.id)),
        )

      return {
        success: 'Category updated',
      }
    } catch (error) {
      console.error(error)
      return {
        error: "Couldn't update category. Please try again",
      }
    } finally {
      revalidatePath('/library')
      revalidatePath('/settings/categories')
    }
  },
)

export const deleteCategory = authAction(
  z.object({ categoryId: z.number() }),
  async ({ categoryId }, { userId }) => {
    try {
      await db
        .delete(categories)
        .where(
          and(eq(categories.userId, userId), eq(categories.id, categoryId)),
        )

      return {
        success: 'Category deleted',
      }
    } catch (error) {
      console.error(error)
      return {
        error: "Couldn't delete category. Please try again",
      }
    } finally {
      revalidatePath('/library')
      revalidatePath('/settings/categories')
    }
  },
)

import { count, db, eq } from '@/lib/database'

import { categories, type NewCategory } from '@yomu/core/database/schema/web'

export async function createCategory(newCategory: NewCategory) {
  const [category] = await db.insert(categories).values(newCategory).returning()

  return category
}

export async function getUserCategories(userId: string) {
  return await db.query.categories.findMany({
    where: eq(categories.userId, userId),
  })
}

export async function getCategoryById(categoryId: number) {
  return await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  })
}

export async function getCategoryByName(categoryName: string) {
  return await db.query.categories.findFirst({
    where: eq(categories.name, categoryName),
  })
}

export async function updateCategory(
  categoryId: number,
  updatedCategory: Partial<NewCategory>,
) {
  const [category] = await db
    .update(categories)
    .set(updatedCategory)
    .where(eq(categories.id, categoryId))
    .returning()

  return category
}

export async function deleteCategory(categoryId: number) {
  const [category] = await db
    .delete(categories)
    .where(eq(categories.id, categoryId))
    .returning()

  return category
}

export async function countUserCategories(userId: string) {
  const [{ count: total }] = await db
    .select({ count: count(categories.id) })
    .from(categories)
    .where(eq(categories.userId, userId))

  return total
}

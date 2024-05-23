'use server'

import { db } from '@/lib/database'
import { getUserOrRedirect } from '../auth'

export const getCategories = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  const categories = await db.query.categories.findMany({
    where: (table, { eq }) => eq(table.userId, userId),
  })

  return categories
}

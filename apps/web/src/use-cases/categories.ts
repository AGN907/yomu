import {
  countUserCategories,
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategoryByName,
  getUserCategories,
  updateCategory,
} from '@/data-access/categories'
import { AuthorizationError, PublicError } from '@/lib/errors'
import { UserSession } from '@/lib/safe-action'

export async function getCategoriesUseCase(user: UserSession) {
  return await getUserCategories(user.id)
}

export async function createCategoryUseCase(
  user: UserSession,
  {
    name,
    isDefault = false,
  }: {
    name: string
    isDefault?: boolean
  },
) {
  const category = await getCategoryByName(name)

  if (category && category.userId === user.id) {
    throw new PublicError('Category already exist!')
  }

  const newCategory = {
    userId: user.id,
    name,
    default: isDefault,
  }
  await createCategory(newCategory)
}

export async function createDefaultCategoryUseCase(user: UserSession) {
  await createCategoryUseCase(user, {
    name: 'default',
    isDefault: true,
  })
}

export async function updateCategoryNameUseCase(
  user: UserSession,
  {
    categoryId,
    name,
  }: {
    categoryId: number
    name: string
  },
) {
  const category = await getCategoryById(categoryId)

  if (!category) {
    throw new PublicError('Category not found')
  }

  if (category.userId !== user.id) {
    throw new AuthorizationError()
  }

  await updateCategory(categoryId, {
    name,
  })
}

export async function deleteCategoryUseCase(
  user: UserSession,
  {
    categoryId,
  }: {
    categoryId: number
  },
) {
  const category = await getCategoryById(categoryId)

  if (!category) {
    throw new PublicError('Category not found')
  }

  if (category.userId !== user.id) {
    throw new AuthorizationError()
  }

  await deleteCategory(categoryId)
}

export async function countUserCategoriesUseCase(user: UserSession) {
  return await countUserCategories(user.id)
}

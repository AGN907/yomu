import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategoryByName,
  getUserCategories,
  updateCategory,
} from '@/data-access/categories'
import { AuthorizationError, PublicError } from '@/lib/errors'
import { UserSession } from '@/lib/safe-action'

export async function getCategoriesUseCase(UserSession: UserSession) {
  return await getUserCategories(UserSession.id)
}

export async function createCategoryUseCase(
  UserSession: UserSession,
  {name, default = false} : {
    name: string
    default?: boolean
  }
) {
  const category = await getCategoryByName(name)

  if (category && category.userId === UserSession.id) {
    throw new PublicError('Category already exist!')
  }

  const newCategory = {
    userId: UserSession.id,
    name,
  }
  await createCategory(newCategory)
}

export async function createDefaultCategoryUseCase(UserSession: UserSession) {
  await createCategoryUseCase(UserSession, {
    name: "default",
    default: true
  })
  
}

export async function updateCategoryNameUseCase(
  UserSession: UserSession,
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

  if (category.userId !== UserSession.id) {
    throw new AuthorizationError()
  }

  await updateCategory(categoryId, {
    name,
  })
}

export async function deleteCategoryUseCase(
  UserSession: UserSession,
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

  if (category.userId !== UserSession.id) {
    throw new AuthorizationError()
  }

  await deleteCategory(categoryId)
}

'use server'

import { getUserCategories } from '@/data-access/categories'
import { authenticatedAction } from '@/lib/safe-action'
import {
  CreateCategorySchema,
  DeleteCategorySchema,
  UpdateCategoryNameSchema,
} from '@/lib/validators/categories'
import {
  createCategoryUseCase,
  deleteCategoryUseCase,
  updateCategoryNameUseCase,
} from '@/use-cases/categories'

import { revalidatePath } from 'next/cache'

export const getCategoriesAction = authenticatedAction.handler(
  async ({ ctx }) => {
    const { user } = ctx

    return await getUserCategories(user.id)
  },
)

export const createCategoryAction = authenticatedAction
  .input(CreateCategorySchema)
  .handler(async ({ input, ctx }) => {
    const { name } = input
    const { user } = ctx

    await createCategoryUseCase(user, { name })

    revalidatePath('/settings/categories')
  })

export const updateCategoryNameAction = authenticatedAction
  .input(UpdateCategoryNameSchema)
  .handler(async ({ input, ctx }) => {
    const { categoryId, name } = input
    const { user } = ctx

    await updateCategoryNameUseCase(user, { categoryId, name })

    revalidatePath('/settings/categories')
  })

export const deleteCategoryAction = authenticatedAction
  .input(DeleteCategorySchema)
  .handler(async ({ input, ctx }) => {
    const { categoryId } = input
    const { user } = ctx

    await deleteCategoryUseCase(user, { categoryId })
  })

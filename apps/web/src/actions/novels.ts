'use server'

import { authenticatedAction } from '@/lib/safe-action'
import {
  GetNovelSchema,
  GetNovelsByCategorySchema,
  ToggleNovelInLibrarySchema,
  UpdateNovelSchema,
} from '@/lib/validators/novels'
import {
  addNovelToLibraryUseCase,
  removeNovelFromLibraryUseCase,
  updateNovelDetailsUseCase,
  getNovelsByCategoryIdUseCase,
  getNovelBySourceAndUrlUseCase,
  createNovelUseCase,
} from '@/use-cases/novels'
import { fetchSourceNovelUseCase } from '@/use-cases/sources'

import { slugify } from '@yomu/core/utils/string'

import { revalidatePath } from 'next/cache'

export const getOrFetchNovelAction = authenticatedAction
  .input(GetNovelSchema)
  .handler(async ({ input, ctx }) => {
    const { sourceId, novelUrl } = input
    const { user } = ctx

    const novelExist = await getNovelBySourceAndUrlUseCase(user, {
      sourceId,
      novelUrl,
    })
    if (novelExist) return novelExist

    const novel = await fetchSourceNovelUseCase({ sourceId, novelUrl })

    return await createNovelUseCase({
      ...novel,
      slug: slugify(novel.title),
      userId: user.id,
    })
  })

export const addNovelToLibraryAction = authenticatedAction
  .input(ToggleNovelInLibrarySchema)
  .handler(async ({ input, ctx }) => {
    const { novelId, categoryId } = input
    const { user } = ctx

    const addedCategoryId = await addNovelToLibraryUseCase(user, {
      novelId,
      categoryId,
    })

    revalidatePath('/novels/[slug]', 'page')

    return addedCategoryId
  })

export const removeNovelFromLibraryAction = authenticatedAction
  .input(ToggleNovelInLibrarySchema.pick({ novelId: true }))
  .handler(async ({ input, ctx }) => {
    const { novelId } = input
    const { user } = ctx

    const removedCategoryId = await removeNovelFromLibraryUseCase(user, {
      novelId,
    })

    revalidatePath('/novels/[slug]', 'page')

    return removedCategoryId
  })

export const updateNovelDetailsAction = authenticatedAction
  .input(UpdateNovelSchema)
  .handler(async ({ input, ctx }) => {
    const { novelId } = input
    const { user } = ctx

    await updateNovelDetailsUseCase(user, { novelId })

    revalidatePath('/novels/[slug]', 'page')
  })

export const getNovelsByCategoryIdAction = authenticatedAction
  .input(GetNovelsByCategorySchema)
  .handler(async ({ input, ctx }) => {
    const { categoryId } = input
    const { user } = ctx

    return await getNovelsByCategoryIdUseCase(user, { categoryId })
  })

import {
  getCategoryById,
  getUserDefaultCategory,
} from '@/data-access/categories'
import { createChapters, getLastNovelChapter } from '@/data-access/chapters'
import {
  countLibraryNovels,
  createNovel,
  getGenres,
  getLatestReadNovels,
  getNovelById,
  getNovelBySourceAndUrl,
  getNovelsByCategoryId,
  updateNovel,
} from '@/data-access/novels'
import { getSourceById } from '@/data-access/sources'
import { createdUpdatedChapters } from '@/data-access/updates'
import { AuthorizationError, PublicError } from '@/lib/errors'
import { type UserSession } from '@/lib/safe-action'
import { sourceManager } from '@/lib/source-manager'

import { type NewNovel } from '@yomu/core/database/schema/web'
import { slugify } from '@yomu/core/utils/string'

export async function createNovelUseCase(novel: NewNovel) {
  return await createNovel(novel)
}

export async function getOrFetchNovelUseCase(
  user: UserSession,
  { sourceId, novelUrl }: { sourceId: string; novelUrl: string },
) {
  const novelExist = await getNovelBySourceAndUrl(user.id, {
    sourceId,
    novelUrl,
  })
  if (novelExist) return novelExist

  const source = getSourceById(sourceId)
  if (!source) {
    throw new PublicError('Source not found')
  }

  const novel = await source.fetchNovel(novelUrl)
  if (!novel) {
    throw new PublicError('Failed to fetch novel from source')
  }

  return await createNovel({
    ...novel,
    slug: slugify(novel.title),
    userId: user.id,
  })
}

export async function getNovelByIdUseCase(
  user: UserSession,
  { novelId }: { novelId: number },
) {
  const novel = await getNovelById(novelId)

  if (!novel) {
    throw new PublicError('Novel not found')
  }

  if (novel.userId !== user.id) {
    throw new AuthorizationError()
  }

  return novel
}

export async function updateNovelUseCase(
  user: UserSession,
  {
    novelId,
    updatedNovel,
  }: { novelId: number; updatedNovel: Partial<NewNovel> },
) {
  const novel = await getNovelById(novelId)

  if (!novel) {
    throw new PublicError('Novel not found')
  }

  if (novel.userId !== user.id) {
    throw new AuthorizationError()
  }

  await updateNovel(novelId, updatedNovel)
}

export async function getNovelBySourceAndUrlUseCase(
  user: UserSession,
  { sourceId, novelUrl }: { sourceId: string; novelUrl: string },
) {
  const novelExist = await getNovelBySourceAndUrl(user.id, {
    sourceId,
    novelUrl,
  })
  if (novelExist) return novelExist
}

export async function addNovelToLibraryUseCase(
  user: UserSession,
  {
    novelId,
    categoryId: selectedCategoryId,
  }: { novelId: number; categoryId: number | undefined },
) {
  // If no category is specified, we'll use the default one
  let categoryId = selectedCategoryId
  if (!categoryId) {
    const defaultCategory = await getUserDefaultCategory(user.id)
    categoryId = defaultCategory.id
  }

  const [novel, category] = await Promise.all([
    getNovelById(novelId),
    getCategoryById(categoryId),
  ])

  if (!novel) {
    throw new PublicError('Novel not found')
  }

  if (!category) {
    throw new PublicError('Category not found')
  }

  if (novel.userId !== user.id) {
    throw new AuthorizationError()
  }

  await updateNovel(novelId, {
    inLibrary: true,
    categoryId: category.id,
  })

  return categoryId
}

export async function removeNovelFromLibraryUseCase(
  user: UserSession,
  { novelId }: { novelId: number },
) {
  const novel = await getNovelById(novelId)
  if (!novel) {
    throw new PublicError('Novel not found')
  }

  if (novel.userId !== user.id) {
    throw new AuthorizationError()
  }

  if (!novel.inLibrary) {
    throw new PublicError('Novel is not in library')
  }

  await updateNovel(novelId, {
    inLibrary: false,
    categoryId: null,
  })

  return novel.categoryId as number
}

export async function countLibraryNovelsUseCase(user: UserSession) {
  return await countLibraryNovels(user.id)
}

export async function getNovelByCategoryUseCase(
  user: UserSession,
  { categoryId }: { categoryId: number },
) {
  const category = await getCategoryById(categoryId)

  if (!category) {
    throw new PublicError('Category not found')
  }

  if (category.userId !== user.id) {
    throw new AuthorizationError()
  }

  return await getNovelsByCategoryId(categoryId)
}

export async function addNovelToCategoryUseCase(
  user: UserSession,
  {
    novelId,
    categoryId,
  }: {
    novelId: number
    categoryId: number
  },
) {
  const [novel, category] = await Promise.all([
    getNovelById(novelId),
    getCategoryById(categoryId),
  ])

  if (!novel) {
    throw new PublicError('Novel not found')
  }

  if (!category) {
    throw new PublicError('Category not found')
  }

  if (novel.userId !== user.id || category.userId !== user.id) {
    throw new AuthorizationError()
  }

  await updateNovel(novelId, { categoryId: category.id })
}

export async function updateNovelDetailsUseCase(
  user: UserSession,
  { novelId }: { novelId: number },
) {
  const novel = await getNovelById(novelId)

  if (!novel) {
    throw new PublicError('Novel not found')
  }

  if (novel.userId !== user.id) {
    throw new AuthorizationError()
  }

  const { sourceId, url, sourceNovelId } = novel
  const source = sourceManager.getSource(sourceId)
  const [fetchedNovelDetails, fetchedNovelChapters] = await Promise.all([
    source.fetchNovel(url),
    source.fetchNovelChapters(novel.url, sourceNovelId),
  ])

  if (!fetchedNovelDetails) {
    throw new PublicError('Failed to fetch novel details')
  }

  if (!fetchedNovelChapters) {
    throw new PublicError('Failed to fetch novel chapters')
  }

  await updateNovel(novelId, {
    ...fetchedNovelDetails,
  })

  const lastNovelchapter = await getLastNovelChapter(user.id, { novelId })
  if (!lastNovelchapter) {
    throw new PublicError('Failed to fetch last novel chapter')
  }

  const newChapters = fetchedNovelChapters
    .filter(({ number }) => number > lastNovelchapter.number)
    .map((chapter) => ({
      ...chapter,
      novelId,
      userId: user.id,
    }))

  const insertedChapters = await createChapters(newChapters)

  await createdUpdatedChapters(
    insertedChapters.map(({ id, novelId, userId }) => ({
      chapterId: id,
      novelId,
      userId,
    })),
  )
}

export async function getNovelUrlPathUseCase(novelId: number) {
  const novel = await getNovelById(novelId)

  if (!novel) {
    throw new PublicError('Novel not found')
  }

  const path = `/novels/${novel.slug}/?source=${novel.sourceId}&novelId=${novelId}`

  return path
}

export async function getLatestReadNovelsUseCase(user: UserSession) {
  return await getLatestReadNovels(user.id)
}

export async function getNovelsByCategoryIdUseCase(
  user: UserSession,
  { categoryId }: { categoryId: number },
) {
  const category = await getCategoryById(categoryId)

  if (!category) {
    throw new PublicError('Category not found')
  }

  if (category.userId !== user.id) {
    throw new AuthorizationError()
  }

  return await getNovelsByCategoryId(categoryId)
}

export async function getGenresDataUseCase(user: UserSession) {
  const genres = await getGenres(user.id)

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

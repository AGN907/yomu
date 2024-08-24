import {
  bulkUpdateChapters,
  createChapters,
  getChapterById,
  getChaptersByIds,
  getChaptersByNovelId,
  getChapterWithNovel,
  getLatestUpdatedChapters,
  getNextChapter,
  getPreviousChapter,
} from '@/data-access/chapters'
import { getNovelById } from '@/data-access/novels'
import { AuthorizationError, PublicError } from '@/lib/errors'
import { UserSession } from '@/lib/safe-action'
import { NewChapter } from '@yomu/core/database/schema/web'

export async function createNovelChaptersUseCase(novelChapters: NewChapter[]) {
  return await createChapters(novelChapters)
}

export async function getNovelChaptersUseCase(
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

  return await getChaptersByNovelId(novelId)
}

export async function getChapterUseCase(
  user: UserSession,
  { chapterId }: { chapterId: number },
) {
  const chapter = await getChapterById(chapterId)
  if (!chapter) {
    throw new PublicError('Chapter not found')
  }

  if (chapter.userId !== user.id) {
    throw new AuthorizationError()
  }

  return chapter
}

export async function getChapterWithNovelUseCase(
  user: UserSession,
  { chapterId }: { chapterId: number },
) {
  const chapter = await getChapterWithNovel(chapterId)
  if (!chapter) {
    throw new PublicError('Chapter not found')
  }

  if (chapter.userId !== user.id) {
    throw new AuthorizationError()
  }

  return chapter
}

export async function markChapterAsReadUseCase(
  user: UserSession,
  { chapterIds }: { chapterIds: number[] },
) {
  const chapters = await getChaptersByIds(chapterIds)
  if (!chapters.some(Boolean)) {
    throw new PublicError('Some of the chapters were not found')
  }

  if (chapters.some(({ userId }) => userId !== user.id)) {
    throw new AuthorizationError()
  }

  return await bulkUpdateChapters(chapterIds, { read: true })
}

export async function markChapterAsUnreadUseCase(
  user: UserSession,
  { chapterIds }: { chapterIds: number[] },
) {
  const chapters = await getChaptersByIds(chapterIds)
  if (!chapters.some(Boolean)) {
    throw new PublicError('Some of the chapters were not found')
  }

  if (chapters.some(({ userId }) => userId !== user.id)) {
    throw new AuthorizationError()
  }

  return await bulkUpdateChapters(chapterIds, { read: false })
}

export async function getNextChapterUseCase(
  user: UserSession,
  { chapterId }: { chapterId: number },
) {
  const chapter = await getChapterById(chapterId)
  if (!chapter) {
    throw new PublicError('Chapter not found')
  }

  if (chapter.userId !== user.id) {
    throw new AuthorizationError()
  }

  return await getNextChapter(chapterId, chapter.number)
}

export async function getPreviousChapterUseCase(
  user: UserSession,
  { chapterId }: { chapterId: number },
) {
  const chapter = await getChapterById(chapterId)
  if (!chapter) {
    throw new PublicError('Chapter not found')
  }

  if (chapter.userId !== user.id) {
    throw new AuthorizationError()
  }

  return await getPreviousChapter(chapterId, chapter.number)
}

export async function getLatestUpdatedChaptersUseCase(
  user: UserSession,
  { limit = 10 }: { limit?: number },
) {
  return await getLatestUpdatedChapters(user.id, { limit })
}

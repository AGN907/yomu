'use server'

import { authenticatedAction } from '@/lib/safe-action'
import {
  GetNextAndPreviousChaptersSchema,
  GetNovelChaptersSchema,
  MarkChapterAsReadSchema,
} from '@/lib/validators/chapters'
import {
  createNovelChaptersUseCase,
  getNextChapterUseCase,
  getNovelChaptersUseCase,
  getPreviousChapterUseCase,
  markChapterAsReadUseCase,
  markChapterAsUnreadUseCase,
} from '@/use-cases/chapters'
import { fetchNovelChaptersUseCase } from '@/use-cases/sources'
import { revalidatePath } from 'next/cache'

export const getOrFetchNovelChapters = authenticatedAction
  .input(GetNovelChaptersSchema)
  .handler(async ({ input, ctx }) => {
    const { novelId } = input
    const { user } = ctx

    const chapters = await getNovelChaptersUseCase(user, { novelId })
    if (chapters.length > 0) return chapters

    const fetchedChapters = await fetchNovelChaptersUseCase(novelId)

    return await createNovelChaptersUseCase(
      fetchedChapters.map((chapter) => ({
        ...chapter,
        novelId: novelId,
        userId: user.id,
      })),
    )
  })

export const getPrevAndNextChaptersAction = authenticatedAction
  .input(GetNextAndPreviousChaptersSchema)
  .handler(async ({ input, ctx }) => {
    const { chapterId } = input
    const { user } = ctx

    const [previousChapter, nextChapter] = await Promise.all([
      getPreviousChapterUseCase(user, { chapterId }),
      getNextChapterUseCase(user, { chapterId }),
    ])

    return { previousChapter, nextChapter }
  })

export const markChapterAsReadAction = authenticatedAction
  .input(MarkChapterAsReadSchema)
  .handler(async ({ input, ctx }) => {
    const { chapterIds } = input
    const { user } = ctx

    await markChapterAsReadUseCase(user, { chapterIds })

    revalidatePath('/novels/[slug]', 'page')
  })

export const markChapterAsUnreadAction = authenticatedAction
  .input(MarkChapterAsReadSchema)
  .handler(async ({ input, ctx }) => {
    const { chapterIds } = input
    const { user } = ctx

    await markChapterAsUnreadUseCase(user, { chapterIds })

    revalidatePath('/novels/[slug]', 'page')
  })

'use server'

import { db, desc, eq } from '@/lib/database'
import { getUserOrRedirect } from '../auth'
import { fetchNovelInfo } from '../novels'

import {
  chapters,
  novels,
  updatedChapters,
} from '@yomu/core/database/schema/web'

import { revalidatePath } from 'next/cache'

export const updateNovel = async (novelId: number) => {
  const user = await getUserOrRedirect()
  const userId = user.id

  try {
    const selectedNovel = await db.query.novels.findFirst({
      where: (table, { and, eq }) =>
        and(eq(table.userId, userId), eq(table.id, novelId)),
      with: {
        chapters: {
          columns: { id: true, number: true },
        },
      },
    })

    if (!selectedNovel) {
      throw new Error(
        "Couldn't find a novel matching the provided id, update aborted",
      )
    }

    const { sourceId, url } = selectedNovel
    const { novel, chapters: novelChapters } = await fetchNovelInfo(
      sourceId,
      url,
    )

    if (!novel) {
      throw new Error('Failed to fetch latest novel data, update aborted')
    }

    const [{ inLibrary }] = await db
      .update(novels)
      .set({
        ...novel,
      })
      .where(eq(novels.id, novelId))
      .returning({ inLibrary: novels.inLibrary })

    const savedChapters = selectedNovel.chapters
    const lastSavedChapterNum = savedChapters[savedChapters.length - 1].number

    const newChapters = novelChapters
      .filter((c) => c.number > lastSavedChapterNum)
      .map((c) => ({ ...c, novelId }))
    const totalNewChapters = newChapters.length

    const isNewChapters = totalNewChapters > 0
    if (isNewChapters) {
      const newInsertedChapters = await db
        .insert(chapters)
        .values(newChapters)
        .returning({
          chapterId: chapters.id,
          novelId: chapters.novelId,
        })

      if (inLibrary) {
        await db.insert(updatedChapters).values(newInsertedChapters)
      }

      return {
        success: `Novel was updated, ${totalNewChapters} new chapters were added`,
      }
    }

    return {
      success: 'Novel was updated, no new chapters were added',
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
  } finally {
    revalidatePath('/novel')
  }
}

export const getUpdatedChapters = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  return await db
    .select({
      novelId: novels.id,
      novelTitle: novels.title,
      novelUrl: novels.url,
      novelThumbnail: novels.thumbnail,
      sourceId: novels.sourceId,
      chapterId: chapters.id,
      chapterTitle: chapters.title,
      chapterUrl: chapters.url,
      chapterNumber: chapters.number,
      id: updatedChapters.id,
      createdAt: updatedChapters.createdAt,
      updatedAt: updatedChapters.updatedAt,
    })
    .from(novels)
    .where(eq(novels.userId, userId))
    .innerJoin(chapters, eq(novels.id, chapters.novelId))
    .innerJoin(updatedChapters, eq(chapters.id, updatedChapters.chapterId))
    .orderBy(desc(updatedChapters.updatedAt), desc(chapters.number))
}

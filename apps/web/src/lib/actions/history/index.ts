'use server'

import { and, db, desc, eq } from '@/lib/database'
import { getUserOrRedirect } from '../auth'

import { chapters, history, novels } from '@yomu/core/database/schema/web'

export const addChapterToHistory = async (
  novelId: number,
  chapterId: number,
) => {
  try {
    await db
      .insert(history)
      .values({
        chapterId,
        novelId,
      })
      .onConflictDoUpdate({
        target: history.novelId,
        set: {
          chapterId,
          updatedAt: new Date(),
        },
      })
  } catch (error) {
    console.error(error)
  }
}

export const getHistoryChapters = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  return await db
    .select({
      id: history.id,
      novelId: novels.id,
      novelTitle: novels.title,
      novelUrl: novels.url,
      novelThumbnail: novels.thumbnail,
      chapterId: chapters.id,
      chapterTitle: chapters.title,
      chapterUrl: chapters.url,
      chapterNumber: chapters.number,
      sourceId: novels.sourceId,
      createdAt: history.createdAt,
      updatedAt: history.updatedAt,
    })
    .from(history)
    .innerJoin(
      novels,
      and(eq(novels.id, history.novelId), eq(novels.userId, userId)),
    )
    .innerJoin(chapters, eq(chapters.id, history.chapterId))
    .orderBy(desc(history.updatedAt))
}

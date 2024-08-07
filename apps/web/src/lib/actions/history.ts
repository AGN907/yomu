'use server'

import { and, db, desc, eq } from '@/lib/database'
import { authAction } from '@/lib/safe-action'
import { AddChapterToHistorySchema } from '@/lib/validators/history'
import { getUserOrRedirect } from './auth'

import { chapters, history, novels } from '@yomu/core/database/schema/web'
import type { HistoryItem } from '@yomu/sources/types'

import { revalidatePath } from 'next/cache'

export const addChapterToHistory = authAction(
  AddChapterToHistorySchema,
  async ({ novelId, chapterId }, { userId }) => {
    try {
      await db
        .insert(history)
        .values({
          chapterId,
          novelId,
          userId,
        })
        .onConflictDoUpdate({
          target: history.novelId,
          set: {
            chapterId,
            updatedAt: new Date(),
          },
        })

      revalidatePath('/history')
    } catch (error) {
      console.error(error)
    }
  },
)

export type HistoryItemWithTimestamps = HistoryItem & {
  createdAt: Date
  updatedAt: Date
}

export const getHistoryChapters = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  try {
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
  } catch (error) {
    console.error(error)
  }
}

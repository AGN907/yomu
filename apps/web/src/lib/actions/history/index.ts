'use server'

import { db } from '@/lib/database'

import { history } from '@yomu/core/database/schema/web'

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

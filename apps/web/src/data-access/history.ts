import { and, db, desc, eq } from '@/lib/database'

import {
  chapters,
  novels,
  history,
  type NewHistory,
} from '@yomu/core/database/schema/web'

export async function upsertHistory(newHistory: NewHistory) {
  const [insertedHistory] = await db
    .insert(history)
    .values(newHistory)
    .onConflictDoUpdate({
      target: history.novelId,
      set: {
        chapterId: newHistory.chapterId,
        updatedAt: new Date(),
      },
    })
    .returning()

  return insertedHistory
}

export async function getUserHistory(userId: string) {
  return await db
    .select({
      id: history.id,
      novelId: novels.id,
      novelTitle: novels.title,
      novelSlug: novels.slug,
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

import { and, db, desc, eq } from '@/lib/database'

import {
  chapters,
  novels,
  updatedChapters,
  type NewUpdatedChapter,
} from '@yomu/core/database/schema/web'

export async function createdUpdatedChapters(
  newUpdatedChapters: NewUpdatedChapter[],
) {
  const [insertedChapters] = await db
    .insert(updatedChapters)
    .values(newUpdatedChapters)
    .returning()

  return insertedChapters
}

export async function getUserUpdatedChapters(userId: string, limit?: number) {
  const userUpdatedChapters = db
    .select({
      novelId: novels.id,
      novelTitle: novels.title,
      novelSlug: novels.slug,
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
    .where(and(eq(novels.userId, userId), eq(novels.inLibrary, true)))
    .innerJoin(chapters, eq(novels.id, chapters.novelId))
    .innerJoin(updatedChapters, eq(chapters.id, updatedChapters.chapterId))
    .orderBy(desc(updatedChapters.updatedAt), desc(chapters.number))

  if (limit) {
    return await userUpdatedChapters.limit(limit)
  }

  return await userUpdatedChapters
}

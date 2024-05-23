'use server'

import { and, db, desc, eq } from '@/lib/database'
import { getUserOrRedirect } from '../auth'

import {
  chapters,
  novels,
  updatedChapters,
} from '@yomu/core/database/schema/web'

export const getLatestUpdatedChapters = async (limit?: number) => {
  const user = await getUserOrRedirect()
  const userId = user.id

  const result = db
    .select({
      novelId: novels.id,
      novelTitle: novels.title,
      novelUrl: novels.url,
      novelThumbnail: novels.thumbnail,
      sourceId: novels.sourceId,
      chapterId: chapters.id,
      chapterTitle: chapters.title,
      chapterNumber: chapters.number,
      updatedAt: updatedChapters.updatedAt,
    })
    .from(novels)
    .innerJoin(updatedChapters, eq(novels.id, updatedChapters.novelId))
    .innerJoin(chapters, eq(updatedChapters.chapterId, chapters.id))
    .orderBy(desc(updatedChapters.updatedAt), desc(chapters.number))
    .where(and(eq(novels.userId, userId), eq(novels.inLibrary, true)))

  if (limit) {
    return await result.limit(limit)
  }

  return await result
}

'use server'

import { and, db, desc, eq } from '@/lib/database'
import { sourceManager } from '@/lib/source-manager'
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
export const getChapterFromDatabase = async (
  chapterId: number,
  chapterNumber: number,
) => {
  return await db.query.chapters.findFirst({
    where: (table, { and, eq }) =>
      and(eq(table.id, chapterId), eq(table.number, chapterNumber)),
    with: {
      novel: true,
    },
  })
}

export const fetchChapterContent = async (
  sourceId: string,
  chapterUrl: string,
) => {
  const source = sourceManager.getSource(sourceId)

  return await source.fetchChapter(chapterUrl)
}

'use server'

import { and, db, desc, eq } from '@/lib/database'
import { authAction } from '@/lib/safe-action'
import { sourceManager } from '@/lib/source-manager'
import {
  FetchChapterContentSchema,
  GetChapterSchema,
  GetNextAndPreviousChapters,
  LatestUpdatedChaptersSchema,
  MarkChapterAsReadSchema,
} from '@/lib/validators/chapters'

import {
  chapters,
  novels,
  updatedChapters,
} from '@yomu/core/database/schema/web'
import { revalidatePath } from 'next/cache'

export const getLatestUpdatedChapters = authAction(
  LatestUpdatedChaptersSchema,
  async ({ limit }, { userId }) => {
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

    try {
      if (limit) {
        return await result.limit(limit)
      }

      return await result
    } catch (error) {
      console.error(error)
    }
  },
)

export const getChapterFromDatabase = authAction(
  GetChapterSchema,
  async ({ chapterId, chapterNumber }, { userId }) => {
    try {
      return await db.query.chapters.findFirst({
        where: (table, { and, eq }) =>
          and(
            eq(table.userId, userId),
            eq(table.id, chapterId),
            eq(table.number, chapterNumber),
          ),
        with: {
          novel: true,
        },
      })
    } catch (error) {
      console.error(error)
    }
  },
)

export const fetchChapterContent = authAction(
  FetchChapterContentSchema,
  async ({ sourceId, chapterUrl }, { userId }) => {
    try {
      const source = sourceManager.getSource(sourceId)

      return await source.fetchChapterContent(chapterUrl)
    } catch (error) {
      console.error(error)
    }
  },
)

export const markChapterAsRead = authAction(
  MarkChapterAsReadSchema,
  async ({ chapterId }) => {
    try {
      await db
        .update(chapters)
        .set({ read: true })
        .where(eq(chapters.id, chapterId))

      revalidatePath('/novel')
    } catch (error) {
      console.error(error)
    }
  },
)

export const getNextAndPreviousChapters = authAction(
  GetNextAndPreviousChapters,
  async ({ currentChapterNumber, novelId }, { userId }) => {
    try {
      const [previousChapter, nextChapter] = await Promise.all([
        db.query.chapters.findFirst({
          where: (table, { and, eq }) =>
            and(
              eq(table.userId, userId),
              eq(table.novelId, novelId),
              eq(table.number, currentChapterNumber - 1),
            ),
        }),
        db.query.chapters.findFirst({
          where: (table, { and, eq }) =>
            and(
              eq(table.userId, userId),
              eq(table.novelId, novelId),
              eq(table.number, currentChapterNumber + 1),
            ),
        }),
      ])

      return { previousChapter, nextChapter }
    } catch (error) {
      console.error(error)
      return { previousChapter: null, nextChapter: null }
    }
  },
)

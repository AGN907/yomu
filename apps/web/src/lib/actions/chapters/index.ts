'use server'

import { and, db, desc, eq, inArray } from '@/lib/database'
import { authAction } from '@/lib/safe-action'
import { sourceManager } from '@/lib/source-manager'
import {
  FetchChapterContentSchema,
  GetChapterSchema,
  GetNextAndPreviousChapters,
  GetNovelChaptersSchema,
  LatestUpdatedChaptersSchema,
  UpdateReadStateSchema,
} from '@/lib/validators/chapters'

import {
  NewChapter,
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

export const updateReadState = authAction(
  UpdateReadStateSchema,
  async ({ chapterIds, read }) => {
    try {
      await db
        .update(chapters)
        .set({ read })
        .where(inArray(chapters.id, chapterIds))

      revalidatePath('/novels')
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

export const getNovelChapters = authAction(
  GetNovelChaptersSchema,
  async ({ novelId }, { userId }) => {
    try {
      const novelExist = await db.query.novels.findFirst({
        where: (table, { and, eq }) =>
          and(eq(table.userId, userId), eq(table.id, novelId)),
        columns: {
          url: true,
          sourceId: true,
          sourceNovelId: true,
        },
      })

      if (!novelExist)
        throw new Error(
          "Failed to fetch novel chapters, novel don't exist in database",
        )

      const savedChapters = await getChaptersFromDatabase(novelId)

      if (savedChapters && savedChapters.length > 0) return savedChapters

      const { sourceId, url, sourceNovelId } = novelExist
      const chapters = await fetchNovelChapters(sourceId, {
        url,
        sourceNovelId,
      })

      if (!chapters)
        throw new Error(
          "Failed to fetch novel chapters, chapters don't exist in source",
        )

      const chaptersWithIds = chapters.map((chapter) => ({
        ...chapter,
        novelId,
        userId,
      }))

      return await saveChaptersToDatabase(chaptersWithIds)
    } catch (error) {
      console.error(error)
    }
  },
)

const fetchNovelChapters = (
  sourceId: string,
  { url, sourceNovelId }: { url: string; sourceNovelId: string },
) => {
  try {
    const source = sourceManager.getSource(sourceId)

    return source.fetchNovelChapters(url, sourceNovelId)
  } catch (error) {
    console.error(error)
  }
}

const getChaptersFromDatabase = (novelId: number, sort?: string) => {
  try {
    return db.query.chapters.findMany({
      where: (table, { and, eq }) => and(eq(table.novelId, novelId)),
      orderBy: (table, { asc, desc }) =>
        sort === 'desc' ? desc(table.number) : asc(table.number),
    })
  } catch (error) {
    console.error(error)
  }
}

const saveChaptersToDatabase = async (novelChapters: NewChapter[]) => {
  try {
    return await db.insert(chapters).values(novelChapters).returning()
  } catch (error) {
    console.error(error)
  }
}

export const getChapterByNovelId = async (
  novelId: number,
  chapterNumber: number,
) => {
  return await db.query.chapters.findFirst({
    where: (table, { and, eq }) =>
      and(eq(table.novelId, novelId), eq(table.number, chapterNumber)),
    with: {
      novel: true,
    },
  })
}

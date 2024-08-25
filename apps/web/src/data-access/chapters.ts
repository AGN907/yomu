import { and, count, db, desc, eq, inArray } from '@/lib/database'

import {
  chapters,
  novels,
  updatedChapters,
  type NewChapter,
} from '@yomu/core/database/schema/web'

export async function createChapters(newChapters: NewChapter[]) {
  const insertedChapters = await db
    .insert(chapters)
    .values(newChapters)
    .returning()

  return insertedChapters
}

export async function getChaptersByNovelId(novelId: number) {
  return await db.query.chapters.findMany({
    where: eq(chapters.novelId, novelId),
  })
}

export async function getChapterById(chapterId: number) {
  return await db.query.chapters.findFirst({
    where: eq(chapters.id, chapterId),
  })
}

export async function getChaptersByIds(chapterIds: number[]) {
  return await db.query.chapters.findMany({
    where: inArray(chapters.id, chapterIds),
  })
}

export async function getChapterWithNovel(chapterId: number) {
  return await db.query.chapters.findFirst({
    where: eq(chapters.id, chapterId),
    with: {
      novel: true,
    },
  })
}

export async function updateChapter(
  chapterId: number,
  updatedChapter: Partial<NewChapter>,
) {
  const [chapter] = await db
    .update(chapters)
    .set(updatedChapter)
    .where(eq(chapters.id, chapterId))
    .returning()

  return chapter
}

export async function bulkUpdateChapters(
  chapterIds: number[],
  updatedChapter: Partial<NewChapter>,
) {
  return await db
    .update(chapters)
    .set(updatedChapter)
    .where(inArray(chapters.id, chapterIds))
    .returning()
}

export async function getNextChapter(chapterId: number, chapterNumber: number) {
  return await db.query.chapters.findFirst({
    where: and(
      eq(chapters.id, chapterId),
      eq(chapters.number, chapterNumber + 1),
    ),
  })
}

export async function getPreviousChapter(
  chapterId: number,
  chapterNumber: number,
) {
  return await db.query.chapters.findFirst({
    where: and(
      eq(chapters.id, chapterId),
      eq(chapters.number, chapterNumber - 1),
    ),
  })
}

export async function countReadChapters(userId: string) {
  const [{ count: total }] = await db
    .select({
      count: count(chapters.id),
    })
    .from(chapters)
    .innerJoin(novels, eq(chapters.novelId, novels.id))
    .where(
      and(
        eq(novels.userId, userId),
        eq(novels.inLibrary, true),
        eq(chapters.read, true),
      ),
    )

  return total
}

export async function countUnreadChapters(userId: string) {
  const [{ count: total }] = await db
    .select({
      count: count(chapters.id),
    })
    .from(chapters)
    .innerJoin(novels, eq(chapters.novelId, novels.id))
    .where(
      and(
        eq(novels.userId, userId),
        eq(novels.inLibrary, true),
        eq(chapters.read, false),
      ),
    )

  return total
}

export async function getLatestUpdatedChapters(
  userId: string,
  { limit }: { limit?: number } = {},
) {
  const query = db
    .select({
      novelId: novels.id,
      novelTitle: novels.title,
      novelSlug: novels.slug,
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
    return await query.limit(limit)
  }

  return await query
}

export async function getLastNovelChapter(
  userId: string,
  { novelId }: { novelId: number },
) {
  return await db.query.chapters.findFirst({
    where: and(eq(chapters.userId, userId), eq(chapters.novelId, novelId)),
    orderBy: desc(chapters.number),
  })
}

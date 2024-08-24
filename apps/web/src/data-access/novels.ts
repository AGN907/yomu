import { SQL, and, count, db, desc, eq, sql } from '@/lib/database'

import {
  type Novel,
  chapters,
  novels,
  history,
  type NewNovel,
} from '@yomu/core/database/schema/web'

export async function createNovel(newNovel: NewNovel) {
  const [novel] = await db.insert(novels).values(newNovel).returning()

  return novel
}

export async function getNovelById(novelId: number) {
  return await db.query.novels.findFirst({
    where: eq(novels.id, novelId),
  })
}

export async function getNovelBySourceAndUrl(
  userId: string,
  { sourceId, novelUrl }: { sourceId: string; novelUrl: string },
) {
  return await db.query.novels.findFirst({
    where: and(
      eq(novels.userId, userId),
      eq(novels.sourceId, sourceId),
      eq(novels.url, novelUrl),
    ),
  })
}

export async function updateNovel(
  novelId: number,
  updatedNovel: Partial<Novel>,
) {
  const [novel] = await db
    .update(novels)
    .set(updatedNovel)
    .where(eq(novels.id, novelId))
    .returning()
  return novel
}

export async function getNovels(userId: string) {
  return await db
    .select()
    .from(novels)
    .where(and(eq(novels.userId, userId), eq(novels.inLibrary, true)))
}

export async function getNovelsByCategoryId(categoryId: number) {
  return await db.query.novels.findMany({
    where: eq(novels.categoryId, categoryId),
  })
}

export async function countLibraryNovels(userId: string) {
  const [{ count: total }] = await db
    .select({ count: count(novels.id) })
    .from(novels)
    .where(and(eq(novels.userId, userId), eq(novels.inLibrary, true)))
  return total
}

export async function countReadChaptersInNovel(
  userId: string,
  novelId: number,
) {
  const [{ count: total }] = await db
    .select({
      count: count(chapters.id),
    })
    .from(novels)
    .innerJoin(chapters, eq(novels.id, chapters.novelId))
    .where(
      and(
        eq(novels.userId, userId),
        eq(novels.id, novelId),
        eq(chapters.read, false),
      ),
    )

  return total
}

export async function getLatestReadNovels(userId: string) {
  // TODO: Optimize query, ordering and limit to 4
  const rows = await db
    .select({
      id: novels.id,
      title: novels.title,
      url: novels.url,
      thumbnail: novels.thumbnail,
      sourceId: novels.sourceId,
      read: chapters.read,
    })
    .from(history)
    .innerJoin(novels, eq(history.novelId, novels.id))
    .orderBy(desc(history.updatedAt))
    .innerJoin(chapters, eq(novels.id, chapters.novelId))
    .where(and(eq(novels.userId, userId), eq(novels.inLibrary, true)))

  return Object.values(
    rows.reduce(
      (acc, row) => {
        if (!acc[row.id]) {
          const { read, ...novel } = row
          acc[novel.id] = { novel: novel as Novel, chapters: [] }
        }
        acc[row.id].chapters.push({ read: row.read })
        return acc
      },
      {} as Record<string, { novel: Novel; chapters: { read: boolean }[] }>,
    ),
  ).slice(0, 4)
}

export async function getGenres(userId: string) {
  return await db
    .select({ genres: novels.genres })
    .from(novels)
    .where(and(eq(novels.userId, userId), eq(novels.inLibrary, true)))
}

import { count, db, desc, eq } from '@/lib/database'
import {
  NewNovel,
  Novel,
  chapters,
  history,
  novels,
} from '@yomu/core/database/schema/web'

export async function createNovel(novel: NewNovel) {
  return await db.insert(novels).values(novel)
}

export async function getNovelById(novelId: number) {
  return await db.query.novels.findFirst({
    where: eq(novels.id, novelId),
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

export async function getLibraryNovels() {
  return await db.select().from(novels).where(eq(novels.inLibrary, true))
}

export async function countLibraryNovels() {
  const [{ numberOfLibraryNovels }] = await db
    .select({ numberOfLibraryNovels: count(novels.id) })
    .from(novels)
    .where(eq(novels.inLibrary, true))
  return numberOfLibraryNovels
}

export async function getLatestReadNovels() {
  return await db
    .select()
    .from(novels)
    .innerJoin(history, eq(novels.id, history.novelId))
    .innerJoin(chapters, eq(history.novelId, chapters.novelId))
    .orderBy(desc(history.updatedAt))
    .limit(4)
}

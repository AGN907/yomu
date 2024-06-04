'use server'
import { and, db, desc, eq } from '@/lib/database'
import { authAction } from '@/lib/safe-action'
import { sourceManager } from '@/lib/source-manager'
import { AddToLibraryScehma } from '@/lib/validators/novels'
import { getUserOrRedirect } from '../auth'

import {
  NewNovel,
  Novel,
  chapters,
  history,
  novels,
} from '@yomu/core/database/schema/web'
import { ChapterItemWithoutContent, NovelItemData } from '@yomu/sources/types'

import { revalidatePath } from 'next/cache'

export const getLatestReadNovels = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

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

export const fetchNovelsByFilter = async (
  sourceId: string,
  page: number,
  latest = true,
) => {
  const source = sourceManager.getSource(sourceId)

  if (!source) {
    throw new Error('Source not found')
  }

  return await source.fetchNovels(page, latest)
}

export const fetchNovelsByQuery = async (
  sourceId: string,
  page: number,
  query: string,
) => {
  const source = sourceManager.getSource(sourceId)

  if (!source) {
    throw new Error('Source not found')
  }

  return await source.searchNovels(page, query)
}

export const getNovelInfo = async (sourceId: string, url: string) => {
  const novelExist = await getNovelFromDatabase(sourceId, url)

  if (novelExist) {
    return novelExist
  }

  const { novel, chapters } = await fetchNovelInfo(sourceId, url)

  if (!novel) {
    throw new Error('Novel not found')
  }

  await saveNovelToDatabase(novel, chapters)

  return getNovelFromDatabase(sourceId, url)
}

export const fetchNovelInfo = async (sourceId: string, url: string) => {
  const source = sourceManager.getSource(sourceId)

  if (!source) {
    throw new Error('Source not found')
  }

  return await source.fetchNovel(url)
}

export const getNovelFromDatabase = async (sourceId: string, url: string) => {
  const user = await getUserOrRedirect()
  const userId = user.id

  return await db.query.novels.findFirst({
    where: (table, { and, eq }) =>
      and(
        eq(table.userId, userId),
        eq(table.sourceId, sourceId),
        eq(table.url, url),
      ),
    with: {
      chapters: true,
    },
  })
}

const saveNovelToDatabase = async (
  novel: NovelItemData,
  novelChapters: ChapterItemWithoutContent[],
) => {
  const user = await getUserOrRedirect()
  const userId = user.id

  const novelWithUserId: NewNovel = {
    ...novel,
    userId,
  }

  await db.transaction(async (tx) => {
    const [novel] = await tx
      .insert(novels)
      .values(novelWithUserId)
      .returning({ novelId: novels.id })

    const novelId = novel.novelId

    const chaptersWithNovelId = novelChapters.map((chapter) => ({
      ...chapter,
      novelId,
    }))

    await tx.insert(chapters).values(chaptersWithNovelId)
  })
}

export const addNovelToLibrary = authAction(
  AddToLibraryScehma,
  async ({ novelId, inLibrary }, { userId }) => {
    try {
      const [{ isAdded }] = await db
        .update(novels)
        .set({ inLibrary: !inLibrary, updatedAt: new Date() })
        .where(and(eq(novels.userId, userId), eq(novels.id, novelId)))
        .returning({ isAdded: novels.inLibrary })

      return {
        success: isAdded
          ? 'Added novel to library'
          : 'Removed novel from library',
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: "Couldn't add to library. Please try again",
        }
      }
    } finally {
      revalidatePath('/novel')
    }
  },
)

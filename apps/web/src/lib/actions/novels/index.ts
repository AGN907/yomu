'use server'
import { and, db, desc, eq } from '@/lib/database'
import { authAction } from '@/lib/safe-action'
import { sourceManager } from '@/lib/source-manager'
import {
  AddToLibrarySchema,
  FetchNovelByFilterSchema,
  FetchNovelsByQuerySchema,
  GetNovelSchema,
  GetNovelsByCategorySchema,
  SaveNovelToLibrarySchema,
  UpdateNovelsByCategorySchema,
} from '@/lib/validators/novels'
import { getUserOrRedirect } from '../auth'
import { updateNovel } from '../updates'

import {
  NewNovel,
  Novel,
  chapters,
  history,
  novels,
} from '@yomu/core/database/schema/web'
import { ChapterItemWithoutContent } from '@yomu/sources/types'

import { revalidatePath } from 'next/cache'

export const getLatestReadNovels = async () => {
  const user = await getUserOrRedirect()
  const userId = user.id

  try {
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
  } catch (error) {
    console.error(error)
    return []
  }
}

export const fetchNovelsByFilter = authAction(
  FetchNovelByFilterSchema,
  async ({ sourceId, page, latest }) => {
    try {
      const source = sourceManager.getSource(sourceId)

      return await source.fetchNovels(page, latest)
    } catch (error) {
      console.error(error)
    }
  },
)

export const fetchNovelsByQuery = authAction(
  FetchNovelsByQuerySchema,
  async ({ sourceId, page, query }) => {
    try {
      const source = sourceManager.getSource(sourceId)

      return await source.searchNovels(page, query)
    } catch (error) {
      console.error(error)
    }
  },
)

export const getNovelInfo = authAction(
  GetNovelSchema,
  async ({ sourceId, url }) => {
    try {
      const { data: novelExist } = await getNovelFromDatabase({ sourceId, url })
      if (novelExist) {
        return novelExist
      }

      const { data: fetchedData } = await fetchNovelInfo({ sourceId, url })
      if (!fetchedData || !fetchedData.novel) {
        throw new Error('Novel not found')
      }

      const { novel, chapters } = fetchedData
      await saveNovelToDatabase({ novel, chapters })

      const { data } = await getNovelFromDatabase({ sourceId, url })
      return data
    } catch (error) {
      console.error(error)
    }
  },
)

export const fetchNovelInfo = authAction(
  GetNovelSchema,
  async ({ sourceId, url }) => {
    try {
      const source = sourceManager.getSource(sourceId)

      return await source.fetchNovel(url)
    } catch (error) {
      console.error(error)
    }
  },
)

export const getNovelFromDatabase = authAction(
  GetNovelSchema,
  async ({ sourceId, url }, { userId }) => {
    try {
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
    } catch (error) {
      console.error(error)
    }
  },
)

const saveNovelToDatabase = authAction(
  SaveNovelToLibrarySchema,
  async ({ novel, chapters: novelChapters }, { userId }) => {
    const novelWithUserId: NewNovel = {
      ...novel,
      userId,
    }
    try {
      await db.transaction(async (tx) => {
        const [novel] = await tx
          .insert(novels)
          .values(novelWithUserId)
          .returning({ novelId: novels.id })

        const novelId = novel.novelId
        const modifiedNovelChapters = novelChapters.map(
          (chapter: ChapterItemWithoutContent) => ({
            ...chapter,
            novelId,
            userId,
          }),
        )

        await tx.insert(chapters).values(modifiedNovelChapters)
      })
    } catch (error) {
      console.error(error)
    }
  },
)

export const addNovelToLibrary = authAction(
  AddToLibrarySchema,
  async ({ novelId, inLibrary, categoryId = null }, { userId }) => {
    try {
      const [{ isAdded }] = await db
        .update(novels)
        .set({
          inLibrary,
          updatedAt: new Date(),
          categoryId,
        })
        .where(and(eq(novels.userId, userId), eq(novels.id, novelId)))
        .returning({ isAdded: novels.inLibrary })

      return {
        success: isAdded ? 'Added novel to library' : 'Removed from library',
      }
    } catch (error) {
      return {
        error: inLibrary
          ? "Couldn't remove novel from library. Please try again"
          : "Couldn't add novel to library. Please try again",
      }
    } finally {
      revalidatePath('/novel')
    }
  },
)

export const getNovelsByCategory = authAction(
  GetNovelsByCategorySchema,
  async ({ categoryId }, { userId }) => {
    try {
      return await db.query.novels.findMany({
        where: and(
          eq(novels.userId, userId),
          eq(novels.inLibrary, true),
          eq(novels.categoryId, categoryId),
        ),
      })
    } catch (error) {
      console.error(error)
    }
  },
)

export const updateNovelsByCategory = authAction(
  UpdateNovelsByCategorySchema,
  async ({ categoryId }) => {
    try {
      const { data: novels = [] } = await getNovelsByCategory({ categoryId })
      if (novels.length === 0) {
        return {
          success: 'There are no novels in this category',
        }
      }

      await Promise.all(
        novels.map((novel) => updateNovel({ novelId: novel.id })),
      )

      return {
        success: `${novels.length} novel${novels.length > 1 ? 's' : ''} was updated`,
      }
    } catch (error) {
      return {
        error: 'Something went wrong. Please try again',
      }
    }
  },
)

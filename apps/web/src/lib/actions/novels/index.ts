'use server'

import { and, db, desc, eq } from '@/lib/database'
import { authAction } from '@/lib/safe-action'
import { sourceManager } from '@/lib/source-manager'
import {
  AddToLibrarySchema,
  FetchNovelByFilterSchema,
  FetchNovelsByQuerySchema,
  GetNovelByIdSchema,
  GetNovelSchema,
  GetNovelsByCategorySchema,
  SaveNovelToDatabaseSchema,
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
import { slugify } from '@yomu/core/utils/string'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
    const { data: novelExist } = await getNovelFromDatabase({ sourceId, url })
    if (novelExist) {
      redirect(`/novels/${novelExist.id}/${slugify(novelExist.title)}`)
    }

    const { data: fetchedNovel } = await fetchNovelInfo({ sourceId, url })
    if (!fetchedNovel) {
      throw new Error('Failed to fetch novel from source')
    }

    await saveNovelToDatabase({ novel: fetchedNovel })

    const { data } = await getNovelFromDatabase({ sourceId, url })

    if (!data) {
      throw new Error('Failed to fetch novel from database')
    }

    const { id, title } = data
    const slug = slugify(title)

    console.log('/novles/' + id + '/' + slug)
    redirect(`/novels/${id}/${slug}`)
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
      })
    } catch (error) {
      console.error(error)
    }
  },
)

const saveNovelToDatabase = authAction(
  SaveNovelToDatabaseSchema,
  async ({ novel }, { userId }) => {
    const novelWithUserId: NewNovel = {
      ...novel,
      userId,
    }
    try {
      const [novel] = await db
        .insert(novels)
        .values(novelWithUserId)
        .returning({ novelId: novels.id })

      return novel
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
      revalidatePath('/novels')
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

export const getNovelById = authAction(
  GetNovelByIdSchema,
  async ({ novelId }, { userId }) => {
    const novel = await db.query.novels.findFirst({
      where: eq(novels.id, novelId),
    })

    if (!novel) {
      throw new Error('Novel not found')
    }

    if (novel.userId !== userId) {
      throw new Error('Unauthorized')
    }

    return novel
  },
)

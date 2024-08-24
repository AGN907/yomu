import { getNovelById } from '@/data-access/novels'
import { getSourceById } from '@/data-access/sources'
import { AuthorizationError, PublicError } from '@/lib/errors'
import { UserSession } from '@/lib/safe-action'

export async function fetchSourceNovelUseCase({
  sourceId,
  novelUrl,
}: {
  sourceId: string
  novelUrl: string
}) {
  const source = getSourceById(sourceId)

  if (!source) {
    throw new PublicError('Source not found')
  }

  const novel = await source.fetchNovel(novelUrl)

  if (!novel) {
    throw new PublicError('Failed to fetch novel from source')
  }

  return novel
}

export async function fetchSourceNovelsByFilterUseCase(
  sourceId: string,
  { page, isLatest }: { page: number; isLatest: boolean },
) {
  const source = getSourceById(sourceId)
  if (!source) {
    throw new PublicError('Source not found')
  }

  const novels = await source.fetchNovels(page, isLatest)
  if (!novels) {
    throw new PublicError('Failed to fetch novels from source')
  }

  return novels
}

export async function fetchSourceNovelsByQueryUseCase(
  sourceId: string,
  { page, query }: { page: number; query: string },
) {
  const source = getSourceById(sourceId)
  if (!source) {
    throw new PublicError('Source not found')
  }

  const novels = await source.searchNovels(page, query)
  if (!novels) {
    throw new PublicError('Failed to fetch novels from source')
  }

  return novels
}

export async function fetchNovelChaptersUseCase(novelId: number) {
  const novel = await getNovelById(novelId)
  if (!novel) {
    throw new PublicError('Novel not found')
  }

  const { sourceId, url, sourceNovelId } = novel
  const source = getSourceById(sourceId)
  if (!source) {
    throw new PublicError('Source not found')
  }

  const chapters = await source.fetchNovelChapters(url, sourceNovelId)

  if (!chapters) {
    throw new PublicError('Failed to fetch novel chapters from source')
  }

  return chapters
}

export async function fetchChapterContentUseCase(
  sourceId: string,
  { chapterUrl }: { chapterUrl: string },
) {
  const source = getSourceById(sourceId)
  if (!source) {
    throw new PublicError('Source not found')
  }

  const chapter = await source.fetchChapterContent(chapterUrl)
  if (!chapter) {
    throw new PublicError('Failed to fetch chapter content from source')
  }

  return chapter.content
}

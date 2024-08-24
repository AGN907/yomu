import { getSourceById } from '@/data-access/sources'
import { PublicError } from '@/lib/errors'

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

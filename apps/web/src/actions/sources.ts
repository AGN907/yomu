'use server'

import { authenticatedAction } from '@/lib/safe-action'
import { FetchSourceNovelsSchema } from '@/lib/validators/sources'
import {
  fetchSourceNovelsByFilterUseCase,
  fetchSourceNovelsByQueryUseCase,
} from '@/use-cases/sources'

export const fetchSourceNovelsAction = authenticatedAction
  .input(FetchSourceNovelsSchema)
  .handler(async ({ input }) => {
    const { sourceId, page, isLatest, query } = input

    if (query) {
      return await fetchSourceNovelsByQueryUseCase(sourceId, { page, query })
    }

    return await fetchSourceNovelsByFilterUseCase(sourceId, { page, isLatest })
  })

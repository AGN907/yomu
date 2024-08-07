import type { NovelItemWithInfo } from '@yomu/sources/types'

import { z } from 'zod'

export const AddToLibrarySchema = z.object({
  novelId: z.number(),
  inLibrary: z.boolean(),
  categoryId: z.number().optional(),
})

export const UpdateNovelSchema = z.object({
  novelId: z.number(),
})

export const UpdateNovelsByCategorySchema = z.object({
  categoryId: z.number(),
})

export const FetchNovelByFilterSchema = z.object({
  sourceId: z.string(),
  page: z.number(),
  latest: z.boolean(),
})

export const FetchNovelsByQuerySchema = z.object({
  sourceId: z.string(),
  page: z.number(),
  query: z.string(),
})

export const GetNovelsByCategorySchema = z.object({
  categoryId: z.number(),
})

export const GetNovelSchema = z.object({
  sourceId: z.string(),
  url: z.string(),
})

export const SaveNovelToDatabaseSchema = z.object({
  novel: z.custom<NovelItemWithInfo>(),
})

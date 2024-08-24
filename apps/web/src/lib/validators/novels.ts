import { z } from 'zod'

export const GetNovelSchema = z.object({
  sourceId: z.string(),
  novelUrl: z.string(),
})

export const ToggleNovelInLibrarySchema = z.object({
  novelId: z.number(),
  categoryId: z.number().optional(),
})

export const UpdateNovelSchema = z.object({
  novelId: z.number(),
})

export const GetNovelsByCategorySchema = z.object({
  categoryId: z.number(),
})

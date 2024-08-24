import { z } from 'zod'

export const FetchSourceNovelsSchema = z.object({
  sourceId: z.string(),
  page: z.number().min(0),
  isLatest: z.boolean().optional().default(false),
  query: z.string().optional(),
})

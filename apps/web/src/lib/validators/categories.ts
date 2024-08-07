import type { Category } from '@yomu/core/database/schema/web'
import { z } from 'zod'

export const CreateNewCategoryScehma = z.object({
  name: z
    .string()
    .min(1, 'Please provide a name')
    .max(31, 'Name is too long. Maximum length is 31 characters'),
})

export const DeleteCategorySchema = z.object({ categoryId: z.number() })

export const UpdateCategorySchema = z.custom<Category>()

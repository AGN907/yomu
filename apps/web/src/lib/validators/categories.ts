import { z } from 'zod'

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Please provide a name')
    .max(31, 'Name is too long. Maximum length is 31 characters'),
})

export type CreateCategoryInput = z.infer<typeof UpdateCategoryNameSchema>

export const UpdateCategoryNameSchema = z.object({
  categoryId: z.number(),
  name: z
    .string()
    .min(1, 'Please provide a name')
    .max(31, 'Name is too long. Maximum length is 31 characters'),
})

export type UpdateCategoryNameInput = z.infer<typeof UpdateCategoryNameSchema>

export const DeleteCategorySchema = UpdateCategoryNameSchema.pick({
  categoryId: true,
})

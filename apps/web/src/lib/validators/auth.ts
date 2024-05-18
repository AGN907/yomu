import { z } from 'zod'

export const signupSchema = z.object({
  username: z
    .string()
    .min(4, 'Please provide your username')
    .max(31, 'Username is too long. Maximum length is 31 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username must use alphanumeric characters with dash and underscore only',
    ),
  password: z
    .string()
    .min(6, 'Password is too short. Minimum length is 6 characters')
    .max(255),
})

export type SignupInput = z.infer<typeof signupSchema>

export const loginSchema = z.object({
  username: z
    .string()
    .min(4, 'Username is too short. Minimum length is 4 characters')
    .max(31, 'Username is too long. Maximum length is 31 characters'),
  password: z
    .string()
    .min(6, 'Password is too short. Minimum length is 6 characters')
    .max(255),
})

export type LoginInput = z.infer<typeof loginSchema>

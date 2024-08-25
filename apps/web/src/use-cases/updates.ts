import {
  createdUpdatedChapters,
  getUserUpdatedChapters,
} from '@/data-access/updates'
import type { UserSession } from '@/lib/safe-action'
import { NewUpdatedChapter } from '@yomu/core/database/schema/web'

export async function createUpdatedChapterUseCase(
  newUpdatedChapters: NewUpdatedChapter[],
) {
  return await createdUpdatedChapters(newUpdatedChapters)
}

export async function getUserUpdatesUseCase(user: UserSession) {
  return await getUserUpdatedChapters(user.id)
}

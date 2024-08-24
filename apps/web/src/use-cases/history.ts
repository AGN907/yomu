import { getChapterById } from '@/data-access/chapters'
import { getUserHistory, upsertHistory } from '@/data-access/history'
import { AuthorizationError, PublicError } from '@/lib/errors'
import type { UserSession } from '@/lib/safe-action'

export async function addChapterToHistoryUseCase(
  user: UserSession,
  { chapterId }: { chapterId: number },
) {
  const chapter = await getChapterById(chapterId)
  if (!chapter) {
    throw new PublicError('Chapter not found')
  }

  if (chapter.userId !== user.id) {
    throw new AuthorizationError()
  }

  await upsertHistory({
    chapterId,
    novelId: chapter.novelId,
    userId: user.id,
  })
}

export async function getUserHistoryUseCase(user: UserSession) {
  return await getUserHistory(user.id)
}

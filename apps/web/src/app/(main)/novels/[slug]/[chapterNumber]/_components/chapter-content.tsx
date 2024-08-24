import { addChapterToHistoryUseCase } from '@/use-cases/history'
import { TrackReadingState } from './track-reading-state'
import { fetchChapterContentUseCase } from '@/use-cases/sources'
import { assertAuthenticated } from '@/lib/session'

import type { Chapter } from '@yomu/core/database/schema/web'

type ChapterContentProps = {
  sourceId: string
  chapter: Chapter
}

async function ChapterContent({ sourceId, chapter }: ChapterContentProps) {
  const { id: chapterId, url: chapterUrl } = chapter

  const content = await fetchChapterContentUseCase(sourceId, {
    chapterUrl,
  })

  const user = await assertAuthenticated()
  await addChapterToHistoryUseCase(user, { chapterId })

  return (
    <div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold md:text-3xl">{chapter.title}</h1>
        {content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <TrackReadingState chapterId={chapterId} />
    </div>
  )
}

export { ChapterContent }

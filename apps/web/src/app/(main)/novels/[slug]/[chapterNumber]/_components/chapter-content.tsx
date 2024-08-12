import { fetchChapterContent } from '@/lib/actions/chapters'
import { addChapterToHistory } from '@/lib/actions/history'
import { TrackReadingState } from './track-reading-state'

import type { Chapter } from '@yomu/core/database/schema/web'

type ChapterContentProps = {
  sourceId: string
  chapter: Chapter
}

async function ChapterContent({ sourceId, chapter }: ChapterContentProps) {
  const { id, novelId, url } = chapter
  const { data: fetchedChapter } = await fetchChapterContent({
    sourceId,
    chapterUrl: url,
  })
  if (!fetchedChapter) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <h3 className="text-xl font-medium">
          No content was extracted from the source
        </h3>
        <p>
          Check if there is any content on the original source, and create an{' '}
          <a
            className="text-blue-500 hover:underline"
            target="_blank"
            href="https://github.com/AGN907/yomu/issues/new"
          >
            issue
          </a>{' '}
          on the github page if there is.
        </p>
      </div>
    )
  }

  const content = fetchedChapter.content

  await addChapterToHistory({ novelId, chapterId: id })

  return (
    <div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold md:text-3xl">{chapter.title}</h1>
        {content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <TrackReadingState chapterId={id} />
    </div>
  )
}

export { ChapterContent }

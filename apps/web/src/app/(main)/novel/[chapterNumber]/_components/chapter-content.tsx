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
  const fetchedChapter = await fetchChapterContent(sourceId, url)
  if (!fetchedChapter) {
    return (
      <div className="space-y-4">
        <p>
          No content was extracted from the website. Check if there is any
          content on the original website, and create an{' '}
          <a
            className="text-blue-500 hover:underline"
            target="_blank"
            href="https://github.com/AGN907/yomu/issues/new"
          >
            issue
          </a>{' '}
          on the github page.
        </p>
      </div>
    )
  }

  const content = fetchedChapter.content

  await addChapterToHistory(novelId, id)

  return (
    <div>
      <h1 className="mb-4 self-start text-2xl font-medium md:text-3xl">
        {chapter.title}
      </h1>
      <div className="space-y-4">
        {content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <TrackReadingState chapterId={id} />
    </div>
  )
}

export { ChapterContent }

import { fetchChapterContent } from '@/lib/actions/chapters'

type ChapterContentProps = {
  sourceId: string
  chapterUrl: string
}

async function ChapterContent({ sourceId, chapterUrl }: ChapterContentProps) {
  const fetchedChapter = await fetchChapterContent(sourceId, chapterUrl)
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

  return (
    <div className="space-y-4">
      {content.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  )
}

export { ChapterContent }

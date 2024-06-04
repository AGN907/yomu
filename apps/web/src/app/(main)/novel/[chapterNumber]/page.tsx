import { GoBack } from '@/components/go-back'
import Spinner from '@/components/spinner'
import { getChapterFromDatabase } from '@/lib/actions/chapters'
import { BottomChapterSection } from './_components/bottom-chapter-section'
import { ChapterContent } from './_components/chapter-content'

import { Suspense } from 'react'

type ChapterPageProps = {
  params: {
    chapterNumber: string
  }
  searchParams: {
    chapterId: string
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: ChapterPageProps) {
  const { chapterNumber } = params
  const { chapterId } = searchParams

  const selectedChapter = await getChapterFromDatabase(
    parseInt(chapterId),
    parseInt(chapterNumber),
  )

  const novelTitle = selectedChapter?.novel?.title || ''

  return {
    title: `Chapter ${chapterNumber} ${novelTitle ? `- ${novelTitle}` : ''} - Yomu`,
  }
}

async function ChapterPage({ params, searchParams }: ChapterPageProps) {
  const { chapterNumber } = params
  const { chapterId } = searchParams

  const selectedChapter = await getChapterFromDatabase(
    parseInt(chapterId),
    parseInt(chapterNumber),
  )

  if (!selectedChapter) {
    throw new Error('Chapter not found')
  }

  const novelId = selectedChapter.novel.id
  const novelUrl = selectedChapter.novel.url
  const sourceId = selectedChapter.novel.sourceId
  const chapterUrl = selectedChapter.url

  return (
    <div className="container relative flex h-auto flex-col items-center">
      <div className="self-start">
        <GoBack href={`/novel?sourceId=${sourceId}&novelUrl=${novelUrl}`} />
      </div>
      <div className="h-full max-w-3xl">
        <h1 className="mb-4 self-start text-2xl font-medium">
          {selectedChapter.title}
        </h1>

        <Suspense fallback={<Spinner size={48} />}>
          <ChapterContent sourceId={sourceId} chapterUrl={chapterUrl} />
        </Suspense>
      </div>
      <BottomChapterSection
        novelId={novelId}
        currentChapterNumber={parseInt(chapterNumber)}
      />
    </div>
  )
}

export default ChapterPage

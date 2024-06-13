import { GoBack } from '@/components/go-back'
import { PageLayout } from '@/components/page-layout'
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
  const { chapterNumber: chapterNumberString } = params
  const { chapterId: chapterIdString } = searchParams

  const chapterNumber = parseInt(chapterNumberString)
  const chapterId = parseInt(chapterIdString)

  const selectedChapter = await getChapterFromDatabase(chapterId, chapterNumber)

  if (!selectedChapter) {
    throw new Error('Chapter not found')
  }

  const novelId = selectedChapter.novel.id
  const novelUrl = selectedChapter.novel.url
  const sourceId = selectedChapter.novel.sourceId

  return (
    <PageLayout
      pageTitle={
        <div className="flex items-center gap-4">
          <GoBack href={`/novel?sourceId=${sourceId}&novelUrl=${novelUrl}`} />
          <h1>{selectedChapter.title}</h1>
        </div>
      }
    >
      <div className="mx-auto h-full max-w-3xl px-8">
        <Suspense fallback={<Spinner size={48} />}>
          <ChapterContent sourceId={sourceId} chapter={selectedChapter} />
        </Suspense>
      </div>
      <BottomChapterSection
        novelId={novelId}
        currentChapterNumber={chapterNumber}
      />
    </PageLayout>
  )
}

export default ChapterPage

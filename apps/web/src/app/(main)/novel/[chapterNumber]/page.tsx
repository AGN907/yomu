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
  const { chapterNumber: chapterNumberString } = params
  const { chapterId: chapterIdString } = searchParams

  const chapterNumber = parseInt(chapterNumberString)
  const chapterId = parseInt(chapterIdString)

  const { data } = await getChapterFromDatabase({ chapterId, chapterNumber })

  const novelTitle = data?.novel?.title || 'Not found'

  return {
    title: `Chapter ${chapterNumber} ${novelTitle ? `- ${novelTitle}` : ''} - Yomu`,
  }
}

async function ChapterPage({ params, searchParams }: ChapterPageProps) {
  const { chapterNumber: chapterNumberString } = params
  const { chapterId: chapterIdString } = searchParams

  const chapterNumber = parseInt(chapterNumberString)
  const chapterId = parseInt(chapterIdString)

  const { data } = await getChapterFromDatabase({ chapterId, chapterNumber })

  if (!data) {
    throw new Error('Chapter not found')
  }

  const novelId = data.novel.id
  const novelUrl = data.novel.url
  const sourceId = data.novel.sourceId

  return (
    <PageLayout
      pageTitle={
        <div className="flex items-center gap-4">
          <GoBack href={`/novel?sourceId=${sourceId}&novelUrl=${novelUrl}`} />
        </div>
      }
    >
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-between gap-2 px-4 md:px-0">
        <Suspense fallback={<Spinner size={48} />}>
          <div className="self-end pb-4 md:pb-0">
            <BottomChapterSection
              novelId={novelId}
              currentChapterNumber={chapterNumber}
            />
          </div>

          <ChapterContent sourceId={sourceId} chapter={data} />
          <BottomChapterSection
            novelId={novelId}
            currentChapterNumber={chapterNumber}
          />
        </Suspense>
      </div>
    </PageLayout>
  )
}

export default ChapterPage

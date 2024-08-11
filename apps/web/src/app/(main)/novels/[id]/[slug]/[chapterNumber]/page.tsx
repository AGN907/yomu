import { GoBack } from '@/components/go-back'
import { PageLayout } from '@/components/page-layout'
import Spinner from '@/components/spinner'
import { getChapterByNovelId } from '@/lib/actions/chapters'
import { BottomChapterSection } from './_components/bottom-chapter-section'
import { ChapterContent } from './_components/chapter-content'

import { slugify, unSlugify } from '@/lib/utils'
import { Suspense } from 'react'

type ChapterPageProps = {
  params: {
    chapterNumber: string
    id: string
    slug: string
  }
  searchParams: {
    chapterId: string
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: ChapterPageProps) {
  const { chapterNumber: chapterNumberString, slug: novelSlug } = params

  const novelTitle = unSlugify(novelSlug)
  const chapterNumber = parseInt(chapterNumberString.match(/\d+/)?.[0] ?? '-1')

  return {
    title: `Chapter ${chapterNumber} ${novelTitle} - Yomu`,
  }
}

async function ChapterPage({ params }: ChapterPageProps) {
  const { id: novelIdString, chapterNumber: chapterNumberString } = params

  const novelId = parseInt(novelIdString)
  const chapterNumber = parseInt(chapterNumberString.match(/\d+/)?.[0] ?? '-1')

  const chapterWithSourceId = await getChapterByNovelId(novelId, chapterNumber)

  if (!chapterWithSourceId) {
    throw new Error('Chapter not found')
  }

  const {
    novel: { title, sourceId },
    ...chapter
  } = chapterWithSourceId

  return (
    <PageLayout
      pageTitle={
        <div className="flex items-center gap-4">
          <GoBack href={`/novels/${novelId}/${slugify(title)}`} />
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

          <ChapterContent sourceId={sourceId} chapter={chapter} />
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

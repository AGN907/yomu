import { GoBack } from '@/components/go-back'
import { PageLayout } from '@/components/page-layout'
import Spinner from '@/components/spinner'
import { getChapterById } from '@/lib/actions/chapters'
import { BottomChapterSection } from './_components/bottom-chapter-section'
import { ChapterContent } from './_components/chapter-content'

import { unSlugify } from '@yomu/core/utils/string'

import type { Route } from 'next'
import { Suspense } from 'react'

type ChapterPageProps = {
  params: {
    slug: string
    chapterNumber: string
  }
  searchParams: {
    chapterId: string
    returnTo?: string
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: ChapterPageProps) {
  const { chapterNumber, slug: novelSlug } = params

  const novelTitle = unSlugify(novelSlug)

  return {
    title: `Chapter ${chapterNumber} ${novelTitle} - Yomu`,
  }
}

async function ChapterPage({ params, searchParams }: ChapterPageProps) {
  const { chapterNumber: chapterNumberString } = params
  const { chapterId, returnTo } = searchParams

  const chapterNumber = parseInt(chapterNumberString)

  const chapterWithSourceId = await getChapterById(Number(chapterId))

  if (!chapterWithSourceId) {
    throw new Error('Chapter not found')
  }

  const {
    novel: { sourceId, id: novelId },
    ...chapter
  } = chapterWithSourceId

  return (
    <PageLayout
      pageTitle={
        <div className="flex items-center gap-4">
          {/* FIXME: When navigating back, returns to previous chapter */}
          <GoBack href={returnTo ? (returnTo as Route) : undefined} />
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

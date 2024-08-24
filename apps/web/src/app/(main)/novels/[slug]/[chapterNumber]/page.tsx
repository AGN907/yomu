import { GoBack } from '@/components/go-back'
import { PageLayout } from '@/components/page-layout'
import Spinner from '@/components/spinner'
import { BottomChapterSection } from './_components/bottom-chapter-section'
import { getChapterWithNovelUseCase } from '@/use-cases/chapters'
import { assertAuthenticated } from '@/lib/session'
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

export async function generateMetadata({ params }: ChapterPageProps) {
  const { chapterNumber, slug: novelSlug } = params

  const novelTitle = unSlugify(novelSlug)

  return {
    title: `Chapter ${chapterNumber} ${novelTitle} - Yomu`,
  }
}

async function ChapterPage({ searchParams }: ChapterPageProps) {
  const { chapterId, returnTo } = searchParams

  const user = await assertAuthenticated()
  const chapterWithNovel = await getChapterWithNovelUseCase(user, {
    chapterId: Number(chapterId),
  })

  const {
    novel: { sourceId },
    ...chapter
  } = chapterWithNovel

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
            <BottomChapterSection chapterId={chapter.id} />
          </div>

          <ChapterContent sourceId={sourceId} chapter={chapter} />
          <BottomChapterSection chapterId={chapter.id} />
        </Suspense>
      </div>
    </PageLayout>
  )
}

export default ChapterPage

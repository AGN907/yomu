import { GoBack } from '@/components/go-back'
import { PageLayout } from '@/components/page-layout'
import { unSlugify } from '@/lib/utils'
import { NovelSkeleton } from './_components/novel-skeleton'
import { NovelOverview } from './novel-overview'

import { Suspense } from 'react'

type NovelPageProps = {
  searchParams: {
    sourceId: string
    novelUrl: string
  }
}

export async function generateMetadata({ searchParams }: NovelPageProps) {
  const { novelUrl } = searchParams

  const title = unSlugify(novelUrl)

  return { title: `${title} - Yomu` }
}

async function NovelPage({ searchParams }: NovelPageProps) {
  const { sourceId, novelUrl } = searchParams

  return (
    <PageLayout
      pageTitle={
        <div className="flex items-center">
          <GoBack />
        </div>
      }
    >
      <Suspense fallback={<NovelSkeleton />}>
        <NovelOverview sourceId={sourceId} novelUrl={novelUrl} />
      </Suspense>
    </PageLayout>
  )
}

export default NovelPage

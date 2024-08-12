import { GoBack } from '@/components/go-back'
import { PageLayout } from '@/components/page-layout'
import { NovelSkeleton } from './_components/novel-skeleton'
import { NovelOverview } from './novel-overview'

import { unSlugify } from '@yomu/core/utils/string'

import { Suspense } from 'react'

type NovelPageProps = {
  params: {
    slug: string
  }
  searchParams: {
    sourceId: string
    novelUrl: string
  }
}

export async function generateMetadata({ params }: NovelPageProps) {
  const { slug } = params

  const title = unSlugify(slug)

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

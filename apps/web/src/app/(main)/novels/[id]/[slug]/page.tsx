import { GoBack } from '@/components/go-back'
import { PageLayout } from '@/components/page-layout'
import { unSlugify } from '@/lib/utils'
import { NovelSkeleton } from './_components/novel-skeleton'
import { NovelOverview } from './novel-overview'

import { Suspense } from 'react'

type NovelPageProps = {
  params: {
    id: string
    slug: string
  }
}

export async function generateMetadata({ params }: NovelPageProps) {
  const { slug } = params

  const title = unSlugify(slug)

  return { title: `${title} - Yomu` }
}

async function NovelPage({ params }: NovelPageProps) {
  const { id } = params

  return (
    <PageLayout
      pageTitle={
        <div className="flex items-center">
          <GoBack />
        </div>
      }
    >
      <Suspense fallback={<NovelSkeleton />}>
        <NovelOverview novelId={Number(id)} />
      </Suspense>
    </PageLayout>
  )
}

export default NovelPage

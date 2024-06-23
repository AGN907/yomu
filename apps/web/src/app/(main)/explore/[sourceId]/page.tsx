import { PageLayout } from '@/components/page-layout'
import Spinner from '@/components/spinner'
import { sourceManager } from '@/lib/source-manager'
import { BrowseSource } from './browse-source'

import { Suspense } from 'react'

type SourcePageProps = {
  params: {
    sourceId: string
  }
  searchParams: {
    filter?: string
    q: string
  }
}

export function generateMetadata({ params }: SourcePageProps) {
  const { sourceId } = params

  const sourceTitle =
    sourceManager.getAllSources().find((s) => s.id === sourceId)?.name ||
    'Not found'

  return {
    title: `${sourceTitle} - Yomu`,
  }
}

async function SourcePage({ params, searchParams }: SourcePageProps) {
  const { sourceId } = params
  const { filter, q } = searchParams

  const isLatest = (filter || 'latest') === 'latest'

  const sourceTitle =
    sourceManager.getAllSources().find((s) => s.id === sourceId)?.name ||
    'Not found'

  return (
    <PageLayout pageTitle={sourceTitle}>
      <Suspense fallback={<Spinner size={48} />}>
        <BrowseSource query={q} isLatest={isLatest} sourceId={sourceId} />
      </Suspense>
    </PageLayout>
  )
}

export default SourcePage

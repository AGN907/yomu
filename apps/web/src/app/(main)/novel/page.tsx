import { db } from '@/lib/database'
import { NovelOverview } from './_components/novel-overview'
import { NovelSkeleton } from './_components/novel-skeleton'

import { Suspense } from 'react'

type NovelPageProps = {
  searchParams: {
    sourceId: string
    novelUrl: string
  }
}

export async function generateMetadata({ searchParams }: NovelPageProps) {
  const { sourceId, novelUrl } = searchParams
  const novelTitle = await db.query.novels.findFirst({
    where: (table, { and, eq }) =>
      and(eq(table.sourceId, sourceId), eq(table.url, novelUrl)),
    columns: {
      title: true,
    },
  })

  return { title: `${novelTitle?.title || 'Novel'} - Yomu` }
}

async function NovelPage({ searchParams }: NovelPageProps) {
  const { sourceId, novelUrl } = searchParams

  return (
    <div className="container flex flex-col items-center justify-center">
      <Suspense fallback={<NovelSkeleton />}>
        <NovelOverview sourceId={sourceId} novelUrl={novelUrl} />
      </Suspense>
    </div>
  )
}

export default NovelPage

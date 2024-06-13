import { PageLayout } from '@/components/page-layout'
import { SourcesList } from './_components/source-list'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore - Yomu',
}

export default function Explore() {
  return (
    <PageLayout pageTitle="Explore">
      <SourcesList />
    </PageLayout>
  )
}

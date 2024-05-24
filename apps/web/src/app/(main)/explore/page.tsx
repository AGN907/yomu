import { SourcesList } from './_components/source-list'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore - Yomu',
}

export default function Explore() {
  return (
    <div className="container space-y-4">
      <h1 className="text-2xl font-semibold md:text-3xl">Explore</h1>
      <SourcesList />
    </div>
  )
}

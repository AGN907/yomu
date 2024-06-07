'use client'

import { sourceManager } from '@/lib/source-manager'

import { SourceInfo } from '@yomu/sources/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@yomu/ui/components/card'

import Link from 'next/link'
import { useMemo } from 'react'

function SourcesList() {
  const sources = sourceManager.getAllSources()

  const sortedSources = useMemo(() => {
    return sources.sort((a, b) => a.name.localeCompare(b.name))
  }, [sources])

  return (
    <div className="space-y-8">
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedSources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </section>
    </div>
  )
}

function SourceCard({ source }: { source: SourceInfo }) {
  const { id, name, lang } = source

  return (
    <Link
      href={{
        pathname: `/explore/${id}`,
        query: { filter: 'latest' },
      }}
    >
      <Card className="flex flex-col justify-between pb-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="flex-shrink-0">{name}</CardTitle>
          <span className="text-muted-foreground">{lang}</span>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </Link>
  )
}

export { SourceCard, SourcesList }

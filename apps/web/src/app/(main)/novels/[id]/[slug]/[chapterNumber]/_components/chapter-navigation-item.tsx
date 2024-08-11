'use client'

import { Button } from '@yomu/ui/components/button'

import Link from 'next/link'
import { useParams } from 'next/navigation'

type ChapterNavigationItemProps = {
  children: React.ReactNode
  chapter: {
    id: number
    number: number
  }
}

function ChapterNavigationButton({
  children,
  chapter,
}: ChapterNavigationItemProps) {
  const { id: novelId, slug: novelSlug } = useParams()

  return (
    <Button size="sm" asChild>
      <Link href={`/novels/${novelId}/${novelSlug}/${chapter.number}`}>
        {children}
      </Link>
    </Button>
  )
}

export { ChapterNavigationButton }

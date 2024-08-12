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
  const { id, number } = chapter
  const { slug: novelSlug } = useParams()

  const chapterPath = `/novels/${novelSlug}/${number}`
  const chapterQuery = {
    chapterId: id,
  }

  return (
    <Button size="sm" asChild>
      <Link
        href={{
          pathname: chapterPath,
          query: chapterQuery,
        }}
      >
        {children}
      </Link>
    </Button>
  )
}

export { ChapterNavigationButton }

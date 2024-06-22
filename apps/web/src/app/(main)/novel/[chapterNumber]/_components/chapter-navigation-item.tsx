import { Button } from '@yomu/ui/components/button'

import Link from 'next/link'

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
  return (
    <Button size="sm" asChild>
      <Link
        href={{
          pathname: `/novel/${chapter.number}`,
          query: {
            chapterId: chapter.id,
          },
        }}
      >
        {children}
      </Link>
    </Button>
  )
}

export { ChapterNavigationButton }

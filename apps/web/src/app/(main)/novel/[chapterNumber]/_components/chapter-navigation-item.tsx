import { Button } from '@yomu/ui/components/button'

import Link from 'next/link'

type ChapterNavigationItemProps = {
  chapter: {
    id: number
    number: number
  }
  Icon: JSX.ElementType
}

function ChapterNavigationButton({
  chapter,
  Icon,
}: ChapterNavigationItemProps) {
  return (
    <Button className="rounded-full" size="icon" asChild>
      <Link
        href={{
          pathname: `/novel/${chapter.number}`,
          query: {
            chapterId: chapter.id,
          },
        }}
      >
        <Icon size={24} />
      </Link>
    </Button>
  )
}

export { ChapterNavigationButton }

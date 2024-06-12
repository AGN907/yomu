import { db } from '@/lib/database'
import { ChapterNavigationButton } from './chapter-navigation-item'

import { ArrowLeft, ArrowRight } from '@yomu/ui/components/icons'

type BottomChapterBarProps = {
  novelId: number
  currentChapterNumber: number
}

async function BottomChapterSection(props: BottomChapterBarProps) {
  const { currentChapterNumber, novelId } = props

  const [previousChapter, nextChapter] = await Promise.all([
    db.query.chapters.findFirst({
      where: (table, { and, eq }) =>
        and(
          eq(table.novelId, novelId),
          eq(table.number, currentChapterNumber - 1),
        ),
      columns: {
        id: true,
        number: true,
      },
    }),
    db.query.chapters.findFirst({
      where: (table, { and, eq }) =>
        and(
          eq(table.novelId, novelId),
          eq(table.number, currentChapterNumber + 1),
        ),
      columns: {
        id: true,
        number: true,
      },
    }),
  ])

  return (
    <div className="sticky bottom-4 mt-8 flex gap-10 md:mt-0">
      <div className="mr-auto">
        {previousChapter ? (
          <ChapterNavigationButton chapter={previousChapter} Icon={ArrowLeft} />
        ) : null}
      </div>
      <div></div>
      <div className="ml-auto">
        {nextChapter ? (
          <ChapterNavigationButton chapter={nextChapter} Icon={ArrowRight} />
        ) : null}
      </div>
    </div>
  )
}

export { BottomChapterSection }

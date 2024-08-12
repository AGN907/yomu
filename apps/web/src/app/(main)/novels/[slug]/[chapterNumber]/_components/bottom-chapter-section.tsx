import { getNextAndPreviousChapters } from '@/lib/actions/chapters'
import { ChapterNavigationButton } from './chapter-navigation-item'

type BottomChapterBarProps = {
  novelId: number
  currentChapterNumber: number
}

async function BottomChapterSection(props: BottomChapterBarProps) {
  const { currentChapterNumber, novelId } = props

  const { data } = await getNextAndPreviousChapters({
    currentChapterNumber,
    novelId,
  })

  if (!data) return

  const { previousChapter, nextChapter } = data

  return (
    <div className="flex justify-center gap-1 md:justify-between">
      <div className="md:mr-auto">
        {previousChapter ? (
          <ChapterNavigationButton chapter={previousChapter}>
            Previous
          </ChapterNavigationButton>
        ) : null}
      </div>
      <div className="md:ml-auto">
        {nextChapter ? (
          <ChapterNavigationButton chapter={nextChapter}>
            Next
          </ChapterNavigationButton>
        ) : null}
      </div>
    </div>
  )
}

export { BottomChapterSection }

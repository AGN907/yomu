import { ChapterNavigationButton } from './chapter-navigation-item'
import { getNextAndPrevChaptersAction } from '@/actions/chapters'

type BottomChapterBarProps = {
  chapterId: number
}

async function BottomChapterSection({ chapterId }: BottomChapterBarProps) {
  const [data, err] = await getNextAndPrevChaptersAction({
    chapterId,
  })

  if (!data && err) return

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

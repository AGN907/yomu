import { CardContainer } from '@/components/card-container'
import { NovelCard } from '@/components/novel-card'
import { getLatestReadNovels } from '@/lib/actions/novels'

import { Progress } from '@yomu/ui/components/progress'

async function CurrentlyReadingNovels() {
  const latestReadNovels = await getLatestReadNovels()

  const isEmpty = latestReadNovels.length === 0

  const renderLatestReadNovels = (item: (typeof latestReadNovels)[0]) => {
    const novel = item.novel
    const chapters = item.chapters

    const totalChapters = chapters.length
    const readChapters = chapters.filter((chapter) => chapter.read).length

    const query = { novelUrl: novel.url, sourceId: novel.sourceId }

    return (
      <div key={novel.id} className="space-y-2">
        <NovelCard
          title={novel.title}
          thumbnail={novel.thumbnail}
          query={query}
        />
        <div className="space-y-1 px-2">
          <div className="flex justify-end">
            <span className="text-muted-foreground text-xs">
              {readChapters}/{totalChapters}
            </span>
          </div>
          <Progress
            value={(readChapters / totalChapters) * 100}
            className="h-2 border"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="xl:col-span-3">
      <CardContainer title={'Currently Reading'}>
        {isEmpty ? (
          <div className="flex h-full flex-1 flex-col items-center justify-center pt-12">
            <p className="text-xl">You didn&apos;t read any novels</p>
            <span className="text-muted-foreground">
              Start reading and they will appear here
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {latestReadNovels.map((novel) => renderLatestReadNovels(novel))}
          </div>
        )}
      </CardContainer>
    </div>
  )
}

export { CurrentlyReadingNovels }

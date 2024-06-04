import { GoBack } from '@/components/go-back'
import { getNovelInfo } from '@/lib/actions/novels'
import { AddToLibrary } from './add-to-library'
import { ChaptersList } from './chapters-list'
import { NovelMetadata } from './novel-metadata'
import { NovelSummary } from './novel-summary'

import { Badge } from '@yomu/ui/components/badge'
import { Card, CardContent, CardFooter } from '@yomu/ui/components/card'

import Image from 'next/image'

type NovelOverviewProps = {
  sourceId: string
  novelUrl: string
}

async function NovelOverview({ sourceId, novelUrl }: NovelOverviewProps) {
  const novelInfo = await getNovelInfo(sourceId, novelUrl)

  if (!novelInfo) {
    return null
  }

  const { chapters, ...novel } = novelInfo

  const genres = novel?.genres || []

  return (
    <div className="space-y-4">
      <GoBack href={`/explore/${sourceId}`} />
      <Card className="w-full rounded-2xl">
        <CardContent className="bg-accent dark:bg-card flex flex-col gap-8 rounded-2xl border p-4 lg:flex-row">
          <div className="flex-shrink-0 self-center lg:self-start">
            <Image
              className="w-[200px] rounded border border-neutral-400 transition-opacity duration-300 hover:opacity-80 dark:border-neutral-800 dark:brightness-90"
              src={novel.thumbnail}
              alt={novel.title}
              width={200}
              height={160}
            />
          </div>

          <div className="flex max-w-3xl flex-col gap-4">
            <h1
              title={novel.title}
              className="text-lg font-semibold sm:text-xl md:text-2xl"
            >
              {novel.title}
            </h1>
            <NovelMetadata
              author={novel.author}
              status={novel.status}
              sourceId={novel.sourceId}
              totalChapters={chapters.length}
            />
            <div className="mt-auto">
              <div className="flex gap-2">
                {genres.map((genre) => (
                  <Badge variant="outline" key={genre}>
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Top right side */}
          <div className="ml-auto flex gap-2">
            <AddToLibrary novelId={novel.id} inLibrary={novel.inLibrary} />
            {/* TODO: Add button to view the novel in the source website */}
            {/* TODO: Add button to update novel data */}
          </div>
        </CardContent>

        <CardFooter className="relative flex flex-col-reverse gap-16 pt-8 xl:flex-row xl:items-start">
          <div className="space-y-4">
            <h3 className="text-2xl font-medium">Chapters</h3>
            <ChaptersList chapters={chapters} />
          </div>
          <div className="w-full space-y-4 xl:sticky xl:top-4 xl:max-w-md">
            <h3 className="text-2xl font-medium">Summary</h3>
            <NovelSummary summary={novel.summary} />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export { NovelOverview }

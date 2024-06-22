import { getCategories } from '@/lib/actions/categories'
import { getNovelInfo } from '@/lib/actions/novels'
import { sourceManager } from '@/lib/source-manager'
import { ChaptersList } from './_components/chapters-list'
import { NovelMetadata } from './_components/novel-metadata'
import { NovelSummary } from './_components/novel-summary'
import { ToggleInLibrary } from './_components/toggle-in-library'
import { UpdateNovelData } from './_components/update-novel-data'
import { ViewInSource } from './_components/view-in-source'

import { Badge } from '@yomu/ui/components/badge'
import { Card, CardContent, CardFooter } from '@yomu/ui/components/card'

import Image from 'next/image'

type NovelOverviewProps = {
  sourceId: string
  novelUrl: string
}

async function NovelOverview({ sourceId, novelUrl }: NovelOverviewProps) {
  const { data: novelInfo } = await getNovelInfo({ sourceId, url: novelUrl })
  const categories = await getCategories()

  if (!novelInfo) {
    throw new Error('Novel not found')
  }

  const { chapters, ...novel } = novelInfo

  const {
    id,
    title,
    url,
    thumbnail,
    summary,
    genres,
    author,
    status,
    inLibrary,
  } = novel
  const currentSource = sourceManager.getSource(sourceId)

  return (
    <Card className="w-full rounded-2xl">
      <CardContent className="bg-card flex flex-col gap-8 rounded-2xl border p-4 lg:flex-row">
        <div className="flex-shrink-0 self-center lg:self-start">
          <Image
            className="w-[200px] rounded border border-neutral-400 transition-opacity duration-300 hover:opacity-80 dark:border-neutral-800 dark:brightness-90"
            src={thumbnail}
            alt={title}
            width={200}
            height={160}
          />
        </div>

        <div className="flex max-w-3xl flex-col gap-4">
          <h1
            title={title}
            className="text-lg font-semibold sm:text-xl md:text-2xl"
          >
            {title}
          </h1>
          <NovelMetadata
            author={author}
            status={status}
            sourceId={sourceId}
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
          <ToggleInLibrary
            novelId={id}
            inLibrary={inLibrary}
            categories={categories}
          />
          <UpdateNovelData novelId={id} />
          <ViewInSource url={currentSource.getOriginalNovelUrl(url)} />
        </div>
      </CardContent>

      <CardFooter className="relative flex flex-col-reverse gap-16 pt-8 xl:flex-row xl:items-start">
        <div className="space-y-4">
          <h3 className="text-2xl font-medium">Chapters</h3>
          <ChaptersList chapters={chapters} />
        </div>
        <div className="w-full space-y-4 xl:sticky xl:top-4 xl:max-w-md">
          <h3 className="text-2xl font-medium">Summary</h3>
          <NovelSummary summary={summary} />
        </div>
      </CardFooter>
    </Card>
  )
}

export { NovelOverview }

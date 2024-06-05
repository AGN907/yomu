import { NovelCard } from '@/components/novel-card'

import { Novel } from '@yomu/core/database/schema/web'

function LibraryList({ novels }: { novels: Novel[] }) {
  return (
    <>
      {novels.map((novel) => (
        <NovelCard
          key={novel.title}
          title={novel.title}
          thumbnail={novel.thumbnail}
          query={{ novelUrl: novel.url, sourceId: novel.sourceId }}
        />
      ))}
    </>
  )
}

export { LibraryList }

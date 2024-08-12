import { NovelCard } from '@/components/novel-card'

import { Novel } from '@yomu/core/database/schema/web'

function LibraryList({ novels }: { novels: Novel[] }) {
  return (
    <>
      {novels.map((novel) => (
        <NovelCard key={novel.id} novel={novel} />
      ))}
    </>
  )
}

export { LibraryList }

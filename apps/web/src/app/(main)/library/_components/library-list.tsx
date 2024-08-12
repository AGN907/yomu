import { NovelCard } from '@/components/novel-card'

import { Novel } from '@yomu/core/database/schema/web'

import Link from 'next/link'

function LibraryList({ novels }: { novels: Novel[] }) {
  return (
    <>
      {novels.map(({ id, slug, title, thumbnail }) => (
        <Link key={id} href={`/novels/${id}/${slug}`}>
          <NovelCard title={title} thumbnail={thumbnail} />
        </Link>
      ))}
    </>
  )
}

export { LibraryList }

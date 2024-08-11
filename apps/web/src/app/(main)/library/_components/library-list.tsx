import { NovelCard } from '@/components/novel-card'
import { slugify } from '@/lib/utils'

import { Novel } from '@yomu/core/database/schema/web'

import Link from 'next/link'

function LibraryList({ novels }: { novels: Novel[] }) {
  return (
    <>
      {novels.map((novel) => (
        <Link
          key={novel.id}
          href={`/novels/${novel.id}/${slugify(novel.title)}`}
        >
          <NovelCard title={novel.title} thumbnail={novel.thumbnail} />
        </Link>
      ))}
    </>
  )
}

export { LibraryList }

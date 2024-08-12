import { slugify } from '@yomu/core/utils/string'
import { NovelItem } from '@yomu/sources/types'

import Image from 'next/image'
import Link from 'next/link'

type NovelCardProps = {
  novel: NovelItem
}

function NovelCard({ novel }: NovelCardProps) {
  const { title, url: novelUrl, thumbnail, sourceId } = novel

  const slug = slugify(title)
  const novelPath = `/novels/${slug}`
  const query = {
    sourceId,
    novelUrl,
  }

  return (
    <Link
      href={{
        pathname: novelPath,
        query,
      }}
    >
      <div className="flex max-w-48 cursor-pointer flex-col items-center space-y-2">
        <Image
          className="h-[230px] w-[180px] rounded border border-neutral-400 object-fill transition-opacity duration-300 hover:opacity-80 dark:border-neutral-800 dark:brightness-90"
          src={thumbnail}
          alt={title}
          width={180}
          height={230}
        />
        <p className="w-11/12 truncate pr-4 text-lg">{title}</p>
      </div>
    </Link>
  )
}

export { NovelCard }

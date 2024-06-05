import Image from 'next/image'
import Link from 'next/link'

type NovelCardProps = {
  title: string
  thumbnail: string
  query: Record<string, string>
}

function NovelCard({ title, thumbnail, query }: NovelCardProps) {
  return (
    <Link
      href={{
        pathname: '/novel',
        query,
      }}
    >
      <div className="flex max-w-48 flex-col items-center space-y-2">
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

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
      <div className="space-y-2">
        <Image
          className="rounded transition-opacity duration-300 hover:opacity-80"
          src={thumbnail}
          alt="lord of the mysteries 2"
          width={160}
          height={200}
        />
        <p className="truncate text-lg">{title}</p>
      </div>
    </Link>
  )
}

export { NovelCard }

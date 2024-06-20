import { Separator } from '@yomu/ui/components/separator'
import Link from 'next/link'

function NotFound() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex items-center gap-2 text-2xl font-semibold md:text-3xl">
        <span>404</span>
        <Separator orientation="vertical" />
        <h2>Not Found</h2>
      </div>
      <p className="text-lg">Could not find requested resource</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Return Home
      </Link>
    </div>
  )
}

export default NotFound

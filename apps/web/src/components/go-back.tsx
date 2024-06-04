import { Button } from '@yomu/ui/components/button'
import { ArrowLeft } from '@yomu/ui/components/icons'

import Link from 'next/link'

type GoBackProps = {
  href: string
}

function GoBack({ href }: GoBackProps) {
  return (
    <Button className="gap-2 hover:no-underline" variant="link" asChild>
      <Link href={href}>
        <ArrowLeft size={24} />
        <span>Back</span>
      </Link>
    </Button>
  )
}

export { GoBack }

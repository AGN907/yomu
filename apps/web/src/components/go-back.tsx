'use client'

import { Button } from '@yomu/ui/components/button'
import { ArrowLeft } from '@yomu/ui/components/icons'

import type { Route } from 'next'
import { useRouter } from 'next/navigation'

type GoBackProps = {
  href?: Route
}

function GoBack({ href }: GoBackProps) {
  const router = useRouter()

  const handleNavigate = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      onClick={handleNavigate}
      className="gap-2 hover:no-underline"
      variant="link"
    >
      <ArrowLeft size={24} />
      <span>Back</span>
    </Button>
  )
}

export { GoBack }

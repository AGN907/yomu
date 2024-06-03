'use client'

import { Button } from '@yomu/ui/components/button'
import { ArrowLeft } from '@yomu/ui/components/icons'
import { useRouter } from 'next/navigation'

function GoBack() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.back()}
      className="gap-2 hover:no-underline"
      variant="link"
    >
      <ArrowLeft size={24} />
      <span>Back</span>
    </Button>
  )
}

export { GoBack }

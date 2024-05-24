'use client'

import { ToggleGroup, ToggleGroupItem } from '@yomu/ui/components/toggle-group'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function FiltersToggle() {
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter') || ''

  return (
    <ToggleGroup type="single" defaultValue={filter}>
      <ToggleGroupItem variant="outline" value="latest" asChild>
        <Link href={{ query: { filter: 'latest' } }}>Latest</Link>
      </ToggleGroupItem>
      <ToggleGroupItem variant="outline" value="popular" asChild>
        <Link href={{ query: { filter: 'popular' } }}>Popular</Link>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export { FiltersToggle }

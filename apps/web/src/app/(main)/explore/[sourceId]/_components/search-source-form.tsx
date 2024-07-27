'use client'

import { useDebounced } from '@/lib/hooks/use-debounced'
import { Input } from '@yomu/ui/components/input'

export function SearchSourceForm({
  onSearchSubmit,
}: {
  onSearchSubmit: (query: string) => void
}) {
  const debouncedOnSearch = useDebounced(onSearchSubmit, 800)

  return (
    <Input
      className="pr-10"
      onChange={(e) => debouncedOnSearch(e.target.value)}
      placeholder="Search novels..."
    />
  )
}

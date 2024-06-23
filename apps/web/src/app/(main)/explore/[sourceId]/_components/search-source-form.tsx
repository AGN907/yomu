'use client'
import { Button } from '@yomu/ui/components/button'
import { Search } from '@yomu/ui/components/icons'
import { Input } from '@yomu/ui/components/input'
import { useState } from 'react'

export function SearchSourceForm({
  onSearchSubmit,
}: {
  onSearchSubmit: (query: string) => void
}) {
  const [query, setQuery] = useState('')

  return (
    <form onSubmit={() => onSearchSubmit(query)}>
      <Input
        name="q"
        className="pr-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search novels..."
      />
      <Button
        className="absolute right-2 top-1/2 -translate-y-1/2"
        size="icon"
        variant="ghost"
      >
        <Search className="size-5" />
      </Button>
    </form>
  )
}

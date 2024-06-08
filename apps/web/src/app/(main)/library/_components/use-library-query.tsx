import { getNovelsByCategory } from '@/lib/actions/novels'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

function useLibraryQuery(initialCategoryId: number) {
  const [categoryId, setCategoryId] = useState(initialCategoryId)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['library', categoryId],
    queryFn: () => getNovelsByCategory(categoryId),
  })

  return {
    data,
    isLoading,
    isFetching,
    categoryId,
    setCategoryId,
  }
}

export { useLibraryQuery }

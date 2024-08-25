'use client'

import { getNovelsByCategoryIdAction } from '@/actions/novels'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type LibraryNovelHookOptions = {
  categoryId: number
}

const HOUR_IN_MILLISECONDS = 3600000

function useLibraryNovels({ categoryId }: LibraryNovelHookOptions) {
  const [selectedCategory, setSelectedCategory] = useState(categoryId)
  const { data, isPending } = useQuery({
    queryKey: ['library_novels', selectedCategory],
    queryFn: async () => {
      const [data] = await getNovelsByCategoryIdAction({
        categoryId: selectedCategory,
      })

      return data
    },
    staleTime: HOUR_IN_MILLISECONDS,
  })

  return { data, isPending, setSelectedCategory }
}

export { useLibraryNovels }

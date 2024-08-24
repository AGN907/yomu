'use client'

import { getNovelsByCategoryIdAction } from '@/actions/novels'
import { UserSession } from '@/lib/safe-action'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type LibraryNovelHookOptions = {
  user: UserSession
  categoryId: number
}

const HOUR_IN_MILLISECONDS = 36000

function useLibraryNovels({ user, categoryId }: LibraryNovelHookOptions) {
  const [selectedCategory, setSelectedCategory] = useState(categoryId)
  const { data, isPending } = useQuery({
    queryKey: ['library_novels', user.id, selectedCategory],
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

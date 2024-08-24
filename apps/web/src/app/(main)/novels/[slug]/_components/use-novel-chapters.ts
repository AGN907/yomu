import { getOrFetchNovelChapters } from '@/actions/chapters'
import { useQuery } from '@tanstack/react-query'

function useNovelChapters(novelId: number) {
  const { data, isPending } = useQuery({
    queryKey: ['chapters', novelId],
    queryFn: async () => {
      const [data] = await getOrFetchNovelChapters({ novelId })

      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })

  return {
    data: data ?? [],
    isPending,
  }
}

export { useNovelChapters }

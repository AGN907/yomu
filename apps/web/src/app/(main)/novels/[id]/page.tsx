import { getNovelById } from '@/lib/actions/novels'

import { redirect } from 'next/navigation'

type PageParams = {
  params: {
    id: string
  }
}

async function NovelIDPage({ params: { id } }: PageParams) {
  const { data: novel } = await getNovelById({ novelId: Number(id) })

  if (!novel) return

  const { slug } = novel
  redirect(`/novels/${id}/${slug}`)

  return <div></div>
}

export default NovelIDPage

import { getNovelById } from '@/lib/actions/novels'
import { slugify } from '@/lib/utils'
import { redirect } from 'next/navigation'

type PageParams = {
  params: {
    id: string
  }
}

async function NovelIDPage({ params: { id } }: PageParams) {
  const { data } = await getNovelById({ novelId: Number(id) })

  if (!data) return

  const slug = slugify(data.title)
  redirect(`/novels/${id}/${slug}`)

  return <div></div>
}

export default NovelIDPage

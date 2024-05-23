import { CardContainer } from '@/components/card-container'
import Spinner from '@/components/spinner'
import { getUserOrRedirect } from '@/lib/actions/auth'
import { getGenresStats } from '@/lib/actions/stats'
import { RecentChapters } from './_components/RecentChapters'
import { CurrentlyReadingNovels } from './_components/currently-reading-novels'
import { StatsList } from './_components/stats-list'

import dynamic from 'next/dynamic'

const GenresGraph = dynamic(
  () => import('./_components/genres-graph').then((mod) => mod.GenresGraph),
  {
    ssr: false,
    loading: () => <Spinner className="pt-12" size={40} />,
  },
)

async function Home() {
  const user = await getUserOrRedirect()
  const genresStats = await getGenresStats()

  return (
    <div className="container flex flex-1 flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl md:text-lg">Hi {user.username},</h1>
        <p className="text-3xl font-medium md:text-2xl">Welcome back!</p>
      </div>
      <StatsList />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <CurrentlyReadingNovels />
        <CardContainer title={'Favorite Genres'}>
          <GenresGraph data={genresStats} />
        </CardContainer>
      </div>
      <RecentChapters />
    </div>
  )
}

export default Home

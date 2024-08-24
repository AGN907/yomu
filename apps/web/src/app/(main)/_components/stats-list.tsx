import { UserSession } from '@/lib/safe-action'
import { getUserStatsUseCase } from '@/use-cases/users'
import { StatCard } from './stat-card'

import {
  BookOpen,
  BookOpenCheck,
  BookText,
  Tag,
} from '@yomu/ui/components/icons'

type StatsListProps = {
  user: UserSession
}

async function StatsList({ user }: StatsListProps) {
  const {
    totalLibraryNovels,
    totalReadChapters,
    totalUnreadChapters,
    totalCategories,
  } = await getUserStatsUseCase(user)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Novels"
        value={totalLibraryNovels}
        icon={<BookText className="text-muted-foreground size-5" />}
      />
      <StatCard
        label="Read Chapters"
        value={totalReadChapters}
        icon={<BookOpenCheck className="text-muted-foreground size-5" />}
      />
      <StatCard
        label="Unread Chapters"
        value={totalUnreadChapters}
        icon={<BookOpen className="text-muted-foreground size-5" />}
      />
      <StatCard
        label="Categories"
        value={totalCategories}
        icon={<Tag className="text-muted-foreground size-5" />}
      />
    </div>
  )
}

export { StatsList }

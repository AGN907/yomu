import { getUserStats } from '@/lib/actions/stats'
import { StatCard } from './stat-card'

import {
  BookOpen,
  BookOpenCheck,
  BookText,
  Tag,
} from '@yomu/ui/components/icons'

async function StatsList() {
  const {
    numberOfLibraryNovels,
    numberOfCompletedChapters,
    numberOfUnreadChapters,
    numberOfCategories,
  } = await getUserStats()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Novels"
        value={numberOfLibraryNovels}
        icon={<BookText className="text-muted-foreground size-5" />}
      />
      <StatCard
        label="Completed Chapters"
        value={numberOfCompletedChapters}
        icon={<BookOpenCheck className="text-muted-foreground size-5" />}
      />
      <StatCard
        label="Unread Chapters"
        value={numberOfUnreadChapters}
        icon={<BookOpen className="text-muted-foreground size-5" />}
      />
      <StatCard
        label="Categories"
        value={numberOfCategories}
        icon={<Tag className="text-muted-foreground size-5" />}
      />
    </div>
  )
}

export { StatsList }

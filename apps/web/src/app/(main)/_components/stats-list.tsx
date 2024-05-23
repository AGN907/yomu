import { getUserStats } from '@/lib/actions/stats'
import { StatCard } from './stat-card'

import {
  BookOpen,
  BookOpenCheck,
  BookText,
  Tag,
} from '@yomu/ui/components/icons'

async function StatsList() {
  const [savedNovels, completedChapters, unreadChapters, totalCategories] =
    await getUserStats()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Novels"
        value={savedNovels}
        icon={<BookText className="text-muted-foreground size-5" />}
      />
      <StatCard
        label="Completed Chapters"
        value={completedChapters}
        icon={<BookOpenCheck className="text-muted-foreground size-5" />}
      />
      <StatCard
        label="Unread Chapters"
        value={unreadChapters}
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

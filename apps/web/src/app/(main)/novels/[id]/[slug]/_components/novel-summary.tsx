'use client'

import { cn } from '@yomu/ui/utils'

import { useState } from 'react'

export type NovelSummaryProps = {
  summary: string
}

function NovelSummary({ summary }: NovelSummaryProps) {
  const [showMore, setShowMore] = useState(false)

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  return (
    <div className={cn('flex flex-col items-center')}>
      <p
        className={cn(
          'h-full max-h-20 overflow-hidden text-sm font-light leading-6 transition-all duration-500 ease-in-out',
          'xl:max-h-full',
          showMore && 'h-auto max-xl:max-h-[500px]',
        )}
      >
        {summary}
      </p>
      <span
        className={cn('cursor-pointer font-semibold', 'xl:hidden')}
        onClick={toggleShowMore}
      >
        {showMore ? 'Show less' : 'Show more'}
      </span>
    </div>
  )
}

export { NovelSummary }

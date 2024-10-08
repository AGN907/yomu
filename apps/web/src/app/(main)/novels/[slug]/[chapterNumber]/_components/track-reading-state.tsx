'use client'

import { updateReadState } from '@/lib/actions/chapters'

import { useAction } from 'next-safe-action/hooks'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type TrackReadingStateProps = {
  chapterId: number
}

function TrackReadingState({ chapterId }: TrackReadingStateProps) {
  const { execute } = useAction(updateReadState)

  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    const markAsRead = () => {
      execute({ chapterIds: [chapterId], read: true })
    }
    if (inView) markAsRead()
  }, [inView, chapterId, execute])

  return <div ref={ref}></div>
}

export { TrackReadingState }

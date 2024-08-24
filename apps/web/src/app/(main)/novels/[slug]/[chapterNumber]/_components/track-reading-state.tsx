'use client'

import { markChapterAsReadAction } from '@/actions/chapters'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type TrackReadingStateProps = {
  chapterId: number
}

function TrackReadingState({ chapterId }: TrackReadingStateProps) {
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    const markAsRead = () => {
      markChapterAsReadAction({ chapterIds: [chapterId] })
    }
    if (inView) markAsRead()
  }, [inView, chapterId])

  return <div ref={ref}></div>
}

export { TrackReadingState }

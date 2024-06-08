'use client'

import Spinner from '@/components/spinner'
import { useInView } from 'react-intersection-observer'

import { useEffect } from 'react'

function LoadMore({ onIntersection }: { onIntersection: () => void }) {
  const { ref, inView } = useInView({ threshold: 0.8 })

  useEffect(() => {
    if (inView) {
      onIntersection()
    }
  }, [inView, onIntersection])

  return (
    <div ref={ref} className="flex justify-center">
      <Spinner size={48} />
    </div>
  )
}

export { LoadMore }

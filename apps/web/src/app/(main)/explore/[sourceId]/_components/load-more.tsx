'use client'

import Spinner from '@/components/spinner'
import { useIntersectionObserver } from '@/lib/hooks/use-intersection-observer'

import { useEffect, useRef } from 'react'

function LoadMore({ onIntersection }: { onIntersection: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  const { isIntersecting } = useIntersectionObserver(ref, { threshold: 0.8 })

  useEffect(() => {
    if (isIntersecting) {
      onIntersection()
    }
  }, [isIntersecting, onIntersection])

  return (
    <div ref={ref} className="flex justify-center">
      <Spinner size={48} />
    </div>
  )
}

export { LoadMore }

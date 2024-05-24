import { useEffect, useState } from 'react'

type IntersectionObserverInit = {
  threshold?: number
}

export const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit,
) => {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting)
    }, options)

    const node = ref?.current

    if (node) {
      observer.observe(node)
    }

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      observer.unobserve(node!)
    }
  }, [options, ref])

  return { isIntersecting }
}

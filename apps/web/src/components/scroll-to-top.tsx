'use client'

import { Button } from '@yomu/ui/components/button'
import { ArrowUp } from '@yomu/ui/components/icons'

import { useEffect, useState } from 'react'

function ScrollToTop() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }

    document.addEventListener('scroll', handleScroll)

    handleScroll()

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      data-state={showBackToTop ? 'visible' : 'hidden'}
      className="fixed bottom-4 right-4 data-[state=hidden]:hidden"
    >
      <Button
        className="rounded-full"
        onClick={handleScrollToTop}
        size="icon"
        variant="secondary"
      >
        <ArrowUp className="size-6" />
      </Button>
    </div>
  )
}

export { ScrollToTop }

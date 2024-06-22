import { Separator } from '@yomu/ui/components/separator'
import { cn } from '@yomu/ui/utils'

import { ComponentPropsWithoutRef } from 'react'

type PageLayoutProps = {
  pageTitle: React.ReactNode
  children: React.ReactNode
} & ComponentPropsWithoutRef<'div'>

function PageLayout({
  pageTitle,
  children,
  className,
  ...props
}: PageLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2 text-3xl font-bold">
        {pageTitle}
      </div>
      <Separator />

      <div
        className={cn(
          'mx-auto grid h-full w-full max-w-6xl items-start gap-6',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

export { PageLayout }

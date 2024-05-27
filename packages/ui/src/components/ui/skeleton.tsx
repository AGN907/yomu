import { cn } from '@ui/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'dark:bg-muted animate-pulse rounded-md bg-neutral-300',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }

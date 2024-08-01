import { cn } from '@yomu/ui/utils'

type ActionsBarProps = {
  actions: React.ReactNode[]
  numberOfSelected: number
}

function ActionsBar({ actions, numberOfSelected }: ActionsBarProps) {
  return (
    <div
      className={cn(
        'bg-muted flex items-center justify-between rounded px-2 py-1 transition-opacity',
        numberOfSelected > 0 ? 'opacity-100 delay-200' : 'opacity-0 delay-0',
      )}
    >
      <p>{numberOfSelected} chapter selected</p>
      <div className="flex gap-2">{actions?.map((action) => action)}</div>
    </div>
  )
}

export { ActionsBar }

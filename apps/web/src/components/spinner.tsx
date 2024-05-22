import { Loader } from '@yomu/ui/components/icons'
import { cn } from '@yomu/ui/utils'

function Spinner({ size, className }: { size?: number; className?: string }) {
  return (
    <div className={cn('flex h-full items-center justify-center', className)}>
      <Loader size={size} className="animate-spin" />
    </div>
  )
}

export default Spinner

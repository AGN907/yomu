'use client'

import { Button, type ButtonProps } from '@yomu/ui/components/button'
import { Loader } from '@yomu/ui/components/icons'
import { cn } from '@yomu/ui/utils'

import { forwardRef } from 'react'

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        disabled={props.disabled ? props.disabled : loading}
        className={cn(className, 'relative')}
      >
        <span className={cn(loading ? 'opacity-0' : '')}>{children}</span>
        {loading ? (
          <div className="absolute inset-0 grid place-items-center">
            <Loader className="size-6 animate-spin" />
          </div>
        ) : null}
      </Button>
    )
  },
)

LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }

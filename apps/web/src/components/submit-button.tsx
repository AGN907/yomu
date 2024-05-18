'use client'

import { LoadingButton } from '@/components/loading-button'

import { ButtonProps } from '@yomu/ui/components/button'

import { forwardRef } from 'react'
import { useFormStatus } from 'react-dom'

const SubmitButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    const { pending } = useFormStatus()

    return (
      <LoadingButton
        ref={ref}
        loading={pending}
        className={className}
        {...props}
      >
        {children}
      </LoadingButton>
    )
  },
)

SubmitButton.displayName = 'SubmitButton'

export { SubmitButton }

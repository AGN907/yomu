import { Button } from '@yomu/ui/components/button'
import { Eye, EyeOff } from '@yomu/ui/components/icons'
import { Input, InputProps } from '@yomu/ui/components/input'
import { cn } from '@yomu/ui/utils'

import { forwardRef, useState } from 'react'

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          placeholder="Your password"
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          disabled={props.value === '' || props.disabled}
        >
          {showPassword ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }

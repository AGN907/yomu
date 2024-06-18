import { useMediaQuery } from '@/lib/hooks/use-media-query'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yomu/ui/components/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@yomu/ui/components/drawer'
import { cn } from '@yomu/ui/utils'

import { createContext, useContext } from 'react'

type ResponsiveDialogContextType = {
  isDesktop: boolean
}

const ResponsiveDialogContext = createContext<
  ResponsiveDialogContextType | undefined
>(undefined)

const useResponsiveDialog = () => {
  const context = useContext(ResponsiveDialogContext)

  if (!context) {
    throw new Error(
      'useResponsiveDialog must be used within a ResponsiveDialog',
    )
  }

  return context
}

type ResponsiveDialogProps = {
  children?: React.ReactNode
  onOpenChange?: (isOpen: boolean) => void
  open?: boolean
}

const ResponsiveDialog = (props: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const Comp = isDesktop ? Dialog : Drawer

  return (
    <ResponsiveDialogContext.Provider value={{ isDesktop }}>
      <Comp {...props} />
    </ResponsiveDialogContext.Provider>
  )
}

type BaseProps = {
  children?: React.ReactNode
  className?: React.ComponentProps<'div'>['className']
  asChild?: boolean
}

const ResponsiveDialogTrigger = (props: BaseProps) => {
  const { isDesktop } = useResponsiveDialog()
  const Comp = isDesktop ? DialogTrigger : DrawerTrigger

  return <Comp {...props} />
}

const ResponsiveDialogContent = ({ className, ...props }: BaseProps) => {
  const { isDesktop } = useResponsiveDialog()
  const Comp = isDesktop ? DialogContent : DrawerContent

  return (
    <Comp
      className={cn({ 'sm:max-w-[425px]': isDesktop }, className)}
      {...props}
    />
  )
}

const ResponsiveDialogBody = ({ className, ...props }: BaseProps) => {
  const { isDesktop } = useResponsiveDialog()

  return (
    <div className={cn({ 'px-4 pt-4': !isDesktop }, className)} {...props} />
  )
}

const ResponsiveDialogHeader = ({ className, ...props }: BaseProps) => {
  const { isDesktop } = useResponsiveDialog()
  const Comp = isDesktop ? DialogHeader : DrawerHeader

  return (
    <Comp className={cn({ 'text-left': !isDesktop }, className)} {...props} />
  )
}

const ResponsiveDialogTitle = (props: BaseProps) => {
  const { isDesktop } = useResponsiveDialog()
  const Comp = isDesktop ? DialogTitle : DrawerTitle

  return <Comp {...props} />
}

const ResponsiveDialogFooter = ({ className, ...props }: BaseProps) => {
  const { isDesktop } = useResponsiveDialog()

  return (
    !isDesktop && (
      <DrawerFooter
        className={cn({ 'pt-2': !isDesktop }, className)}
        {...props}
      />
    )
  )
}

const ResponsiveDialogClose = (props: BaseProps) => {
  const { isDesktop } = useResponsiveDialog()

  return !isDesktop && <DrawerClose {...props} />
}

export {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
}

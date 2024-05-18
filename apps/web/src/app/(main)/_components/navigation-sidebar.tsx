'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { logout } from '@/lib/actions/auth'

import { Button } from '@yomu/ui/components/button'
import {
  BadgeAlert,
  Compass,
  HistoryIcon,
  Home,
  Library,
  Menu,
  Settings,
} from '@yomu/ui/components/icons'
import { Separator } from '@yomu/ui/components/separator'
import { cn } from '@yomu/ui/utils'

import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const MENUITEMS = [
  {
    name: 'General',
    children: [
      {
        name: 'Home',
        href: '/',
        Icon: Home,
      },
      {
        name: 'Explore',
        href: '/explore',
        Icon: Compass,
      },
      {
        name: 'Library',
        href: '/library',
        Icon: Library,
      },
      {
        name: 'Updates',
        href: '/updates',
        Icon: BadgeAlert,
      },
      {
        name: 'History',
        href: '/history',
        Icon: HistoryIcon,
      },
    ],
  },
  {
    name: 'Manage',
    children: [
      {
        name: 'Settings',
        href: '/settings',
        Icon: Settings,
      },
    ],
  },
]

function NavigationSidebar() {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div>
      <div
        data-state={isSidebarOpen ? 'open' : 'closed'}
        onClick={() => setIsSidebarOpen(false)}
        className="peer absolute inset-0 z-10 hidden h-full w-full bg-neutral-900/80 data-[state=open]:max-md:block"
      />
      <div
        className={cn(
          'bg-background fixed z-20 flex h-full w-60 flex-col gap-4 p-2 md:border-r',
          'transition-transform duration-300 peer-data-[state=closed]:ease-out peer-data-[state=open]:ease-in peer-data-[state=closed]:max-md:-translate-x-full peer-data-[state=open]:max-md:translate-x-0',
        )}
      >
        <div className="flex items-center gap-2 px-2">
          <Image src="/logo.svg" width={60} height={60} alt="Logo" />
          <span className="text-3xl font-medium">Yomu</span>
        </div>
        <Separator />
        <nav className="flex flex-col gap-8">
          {MENUITEMS.map((section) => (
            <div key={section.name} className="space-y-2">
              <h3 className="text-muted-foreground ml-2">{section.name}</h3>

              {section.children.map(({ name, href, Icon }) => (
                <NavigationSidebarItem
                  onClick={() => setIsSidebarOpen(false)}
                  key={name}
                  href={href}
                  isActive={pathname === href}
                >
                  <Icon size={22} />
                  <span>{name}</span>
                </NavigationSidebarItem>
              ))}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex gap-4">
          <form action={logout} className="flex-grow">
            <Button className="w-full" type="submit">
              Log out
            </Button>
          </form>
          <ThemeToggle />
        </div>
      </div>
      <div className="px-2 pt-2">
        <Button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden"
          variant="link"
          size="icon"
        >
          <Menu size={40} />
        </Button>
      </div>
    </div>
  )
}

type NavigationSidebarItemProps = {
  children: React.ReactNode
  isActive: boolean
} & LinkProps

function NavigationSidebarItem({
  children,
  href,
  isActive,
  ...props
}: NavigationSidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'hover:bg-accent/70 flex items-center gap-4 rounded-md px-4 py-2 text-lg md:text-base',
        isActive && 'bg-accent font-medium',
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export { NavigationSidebar }

'use client'

import { cn } from '@yomu/ui/utils'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SIDEBARITEMS = [
  {
    name: 'Account',
    path: '/settings',
  },
  {
    name: 'Categories',
    path: '/settings/categories',
  },
]

function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="text-muted-foreground grid gap-4">
      {SIDEBARITEMS.map(({ name, path }) => (
        <Link
          key={name}
          href={path as Route}
          className={cn(pathname === path ? 'text-primary font-semibold' : '')}
        >
          {name}
        </Link>
      ))}
    </nav>
  )
}

export { SettingsSidebar }

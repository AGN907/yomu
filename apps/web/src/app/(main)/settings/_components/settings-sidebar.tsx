'use client'

import { cn } from '@yomu/ui/utils'

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
  {
    name: 'Preferences',
    path: '/settings/preferences',
  },
]

function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="text-muted-foreground grid gap-4">
      {SIDEBARITEMS.map(({ name, path }) => (
        <Link
          key={name}
          href={path}
          className={cn(pathname === path ? 'text-primary font-semibold' : '')}
        >
          {name}
        </Link>
      ))}
    </nav>
  )
}

export { SettingsSidebar }

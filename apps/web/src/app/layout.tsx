import Providers from '../providers'

import '@yomu/ui/styles.css'
import { cn } from '@yomu/ui/utils'

import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yomu',
  description: 'Yomu - Your open source novel reader',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'flex min-h-screen flex-col md:flex-row',
          GeistSans.className,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

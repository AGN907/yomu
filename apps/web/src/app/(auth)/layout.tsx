import type { Metadata } from 'next'

import Providers from '../../providers'

import '@yomu/ui/styles.css'

export const metadata: Metadata = {
  title: 'Yomu',
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="flex min-h-screen items-center justify-center">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'

import Providers from '../../providers'

import '@yomu/ui/styles.css'


export const metadata: Metadata = {
  title: 'Yomu',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className='flex'>{children}</main>
        </Providers>
      </body>
    </html>
  )
}

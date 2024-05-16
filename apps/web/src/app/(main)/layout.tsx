import type { Metadata } from 'next'
import Providers from '../../providers'
import '../globals.css'

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
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}

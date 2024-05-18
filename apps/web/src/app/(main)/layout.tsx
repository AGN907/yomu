import { NavigationSidebar } from './_components/navigation-sidebar'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <NavigationSidebar />
      <main>{children}</main>
    </>
  )
}

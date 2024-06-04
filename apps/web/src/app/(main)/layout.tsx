import { NavigationSidebar } from './_components/navigation-sidebar'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <NavigationSidebar />
      <main className="flex flex-1 py-4 md:ml-60 md:py-6">{children}</main>
    </>
  )
}

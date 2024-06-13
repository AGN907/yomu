import { PageLayout } from '@/components/page-layout'
import { SettingsSidebar } from './_components/settings-sidebar'

export const metadata = {
  title: 'Settings - Yomu',
}

function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout
      pageTitle="Settings"
      className="md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
    >
      <SettingsSidebar />
      <div className="grid gap-6">{children}</div>
    </PageLayout>
  )
}

export default SettingsLayout

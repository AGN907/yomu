import { getUserOrRedirect } from '@/lib/actions/auth'
import { PasswordFormCard } from './_components/password-form-card'
import { UsernameFormCard } from './_components/username-form-card'

async function AccountForm() {
  const user = await getUserOrRedirect()
  const username = user.username

  return (
    <div className="space-y-8">
      <UsernameFormCard username={username} />
      <PasswordFormCard />
    </div>
  )
}

export { AccountForm }

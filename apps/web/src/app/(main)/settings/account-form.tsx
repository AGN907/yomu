import { assertAuthenticated } from '@/lib/session'
import { PasswordFormCard } from './_components/password-form-card'
import { UsernameFormCard } from './_components/username-form'

async function AccountForm() {
  const user = await assertAuthenticated()
  const username = user.username

  return (
    <div className="space-y-8">
      <UsernameFormCard defaultUsername={username} />
      <PasswordFormCard />
    </div>
  )
}

export { AccountForm }

import { roles } from '@/config/config'
import { requireAuth } from '@/middleware/auth.middleware'
import { UsersPage } from '@/pages/user/Users'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/users/')({
  loader: async () => {
    const authResult = await requireAuth(roles.users)
    if (authResult.redirect) {
      throw redirect({ to: authResult.redirect })
    }
    return authResult.user
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <UsersPage />
}

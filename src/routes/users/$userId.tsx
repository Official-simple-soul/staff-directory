import { userApi } from '@/api/user.api'
import { requireAdminAuth } from '@/middleware/auth.middleware'
import ViewUser from '@/pages/user/ViewUser'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$userId')({
  loader: async ({ params }) => {
    const authResult = await requireAdminAuth()
    if (authResult.redirect) {
      throw redirect({ to: authResult.redirect })
    }
    return await userApi.getUserById(params.userId)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const user = Route.useLoaderData()

  return <ViewUser user={user} />
}

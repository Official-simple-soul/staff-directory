import DashboardLayout from '@/layout/DashboardLayout'
import { requireAdminAuth } from '@/middleware/auth.middleware'
import { ContentPage } from '@/pages/content/Content'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/content/')({
  loader: async () => {
    const authResult = await requireAdminAuth()
    if (authResult.redirect) {
      throw redirect({ to: authResult.redirect })
    }
    return authResult.user
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <ContentPage />
    </DashboardLayout>
  )
}

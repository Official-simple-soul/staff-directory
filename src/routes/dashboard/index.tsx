import DashboardLayout from '@/layout/DashboardLayout'
import { requireAdminAuth } from '@/middleware/auth.middleware'
import AnalyticsDashboard from '@/pages/Overview'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
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
      <AnalyticsDashboard />
    </DashboardLayout>
  )
}

import DashboardLayout from '@/layout/DashboardLayout'
import { requireAdminAuth } from '@/middleware/auth.middleware'
import Employees from '@/pages/employee/Employees'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/')({
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
      <Employees />
    </DashboardLayout>
  )
}

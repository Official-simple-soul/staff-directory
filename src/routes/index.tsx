import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/layout/DashboardLayout'
import Employees from '@/pages/employee/Employees'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <DashboardLayout>
      <Employees />
    </DashboardLayout>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '@/layout/DashboardLayout'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <DashboardLayout>
      <p>Index</p>
    </DashboardLayout>
  )
}

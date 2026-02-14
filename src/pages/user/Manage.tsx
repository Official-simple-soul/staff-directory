import DashboardLayout from '@/layout/DashboardLayout'

function Manage({ type }: { type: string }) {
  return (
    <DashboardLayout>
      <div>Manage Users Page for type: {type}</div>
    </DashboardLayout>
  )
}

export default Manage

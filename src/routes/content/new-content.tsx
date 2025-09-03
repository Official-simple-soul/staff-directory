import DashboardLayout from '@/layout/DashboardLayout'
import { requireAdminAuth } from '@/middleware/auth.middleware'
import NewContent from '@/pages/content/NewContent'
import type { Content } from '@/types/content.type'
import { createFileRoute, redirect, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/content/new-content')({
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
  const content = useSearch({ from: '/content/new-content' }) as Content | null

  return (
    <DashboardLayout>
      <NewContent contentToEdit={content} />
    </DashboardLayout>
  )
}

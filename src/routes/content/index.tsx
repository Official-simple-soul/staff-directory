import { requireAuth } from '@/middleware/auth.middleware'
import { ContentPage } from '@/pages/content/Content'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/content/')({
  loader: async () => {
    const authResult = await requireAuth(['admin', 'super-admin'])
    if (authResult.redirect) {
      throw redirect({ to: authResult.redirect })
    }
    return authResult.user
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <ContentPage />
}

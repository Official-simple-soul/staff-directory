import { requireAuth } from '@/middleware/auth.middleware'
import { ContentPage } from '@/pages/content/Content'
import { createFileRoute, redirect } from '@tanstack/react-router'

type ContentSearch = {
  view: 'list' | 'grid'
  mode: 'reading' | 'watching'
}

export const Route = createFileRoute('/content/')({
  validateSearch: (search: Record<string, unknown>): ContentSearch => {
    return {
      view: (search?.view as 'list' | 'grid') ?? 'grid',
      mode: (search?.mode as 'reading' | 'watching') ?? 'reading',
    }
  },
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

import Manage from '@/pages/user/Manage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/manage/')({
  validateSearch: (search: Record<string, unknown>): { type: string } => {
    return {
      type: (search?.type as string) ?? 'all',
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { type } = Route.useSearch()

  return <Manage type={type} />
}

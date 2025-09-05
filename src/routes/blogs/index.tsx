import { roles } from '@/config/config'
import { requireAuth } from '@/middleware/auth.middleware'
import BlogPage from '@/pages/blogs/Blog'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/')({
  loader: async () => {
    const authResult = await requireAuth(roles.blogs)
    if (authResult.redirect) {
      throw redirect({ to: authResult.redirect })
    }
    return authResult.user
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <BlogPage />
}

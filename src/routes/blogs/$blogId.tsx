import { roles } from '@/config/config'
import { requireAuth } from '@/middleware/auth.middleware'
import ViewBlog from '@/pages/blogs/ViewBlog'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/$blogId')({
  loader: async () => {
    const authResult = await requireAuth(roles.singleBlog)
    if (authResult.redirect) {
      throw redirect({ to: authResult.redirect })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { blogId } = Route.useParams()

  return <ViewBlog id={blogId} />
}

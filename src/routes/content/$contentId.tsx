import { contentApi } from '@/api/content.api'
import { requireAdminAuth } from '@/middleware/auth.middleware'
import ViewContent from '@/pages/content/ViewContent'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/content/$contentId')({
  loader: async ({ params }) => {
    const authResult = await requireAdminAuth()
    if (authResult.redirect) {
      throw redirect({ to: authResult.redirect })
    }

    return await contentApi.getContentById(params.contentId)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { contentId } = Route.useParams()
  const content = Route.useLoaderData()

  return <ViewContent content={content!} contentId={contentId} />
}

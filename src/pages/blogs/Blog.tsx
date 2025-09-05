import React, { useState } from 'react'
import { Center, Text } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import PageHeader from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import ActionModal from '@/components/modals/ActionModal'
import { colors } from '@/theme/theme'
import { useBlogs, useDeleteBlog } from '@/services/blog.service'
import BlogViewToggle from './components/BlogViewToggle'
import BlogGrid from './components/BlogGrid'
import BlogList from './components/BlogList'
import { IconTrash } from '@tabler/icons-react'
import DashboardLayout from '@/layout/DashboardLayout'

export const BlogPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'approved' | 'banned'
  >('all')
  const { data: blogs, error, isLoading } = useBlogs()
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog()
  const [blogIdToDelete, setBlogIdToDelete] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleView = (blogId: string) => {
    navigate({ to: `/blogs/${blogId}` })
  }

  const handleEdit = (blogId: string) => {
    navigate({ to: `/blogs/edit/${blogId}` })
  }

  const handleDelete = () => {
    if (!blogIdToDelete) return

    deleteBlog(blogIdToDelete, {
      onSuccess: () => {
        setBlogIdToDelete(null)
      },
    })
  }

  const filteredBlogs =
    statusFilter === 'all'
      ? blogs
      : blogs?.filter((blog) =>
          statusFilter === 'approved' ? blog.isApproved : !blog.isApproved,
        )

  if (error) {
    return (
      <Center style={{ height: '50vh' }}>
        <Text c="red">Error loading blogs: {error.message}</Text>
      </Center>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Blog Management"
        subtitle="Create and manage all blog posts"
        // actionLabel="Create New Blog"
        // onAction={() => navigate({ to: '/blogs' })}
      />

      <BlogViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading ? (
        <BlogGrid isLoading={true} />
      ) : filteredBlogs && filteredBlogs.length > 0 ? (
        viewMode === 'grid' ? (
          <BlogGrid
            blogs={filteredBlogs}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={setBlogIdToDelete}
          />
        ) : (
          <BlogList
            blogs={filteredBlogs}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={setBlogIdToDelete}
          />
        )
      ) : (
        <Center py="xl">
          <EmptyState
            title="No blogs yet"
            description="Get started by creating your first blog post"
            // action={
            //   <AppButton onClick={() => navigate({ to: '/blogs' })}>
            //     Create New Blog
            //   </AppButton>
            // }
          />
        </Center>
      )}

      <ActionModal
        opened={!!blogIdToDelete}
        onClose={() => setBlogIdToDelete(null)}
        title={<span className="text-danger">Confirm Delete</span>}
        icon={
          <div className="bg-danger/10 p-2 rounded-full size-14 flex justify-center items-center">
            <IconTrash size={28} color={colors.danger} />
          </div>
        }
        message={
          <p className="text-info text-sm">
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </p>
        }
        primaryButtonText={'Delete'}
        onPrimaryButtonClick={() => {
          handleDelete()
        }}
        isPrimaryButtonLoading={isDeleting}
        primaryButtonColor={colors.danger}
        secondaryButtonText="Cancel"
        onSecondaryButtonClick={() => {
          setBlogIdToDelete(null)
        }}
      />
    </DashboardLayout>
  )
}

export default BlogPage

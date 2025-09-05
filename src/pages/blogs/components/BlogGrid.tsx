import React from 'react'
import { Grid, Skeleton, Card } from '@mantine/core'
import BlogCard from './BlogCard'
import type { Blog } from '@/types/blog.type'

interface BlogGridProps {
  blogs?: Blog[]
  isLoading?: boolean
  onView?: (blogId: string) => void
  onEdit?: (blogId: string) => void
  onDelete?: (blogId: string) => void
}

const BlogGrid: React.FC<BlogGridProps> = ({
  blogs = [],
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <Grid>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4, xl: 3 }}>
            <Card padding="lg" radius="md" withBorder>
              <Skeleton height={200} mb="md" />
              <Skeleton height={20} mb="xs" />
              <Skeleton height={16} mb="md" />
              <Skeleton height={16} width="70%" />
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onView={() => onView?.(blog.id)}
          onEdit={() => onEdit?.(blog.id)}
          onDelete={() => onDelete?.(blog.id)}
        />
      ))}
    </div>
  )
}

export default BlogGrid

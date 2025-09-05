// src/pages/blog/components/BlogViewToggle.tsx
import React from 'react'
import { Paper, Group, SegmentedControl } from '@mantine/core'
import { IconList, IconGridDots } from '@tabler/icons-react'

interface BlogViewToggleProps {
  viewMode: 'list' | 'grid'
  onViewModeChange: (mode: 'list' | 'grid') => void
  statusFilter: 'all' | 'approved' | 'banned'
  onStatusFilterChange: (filter: 'all' | 'approved' | 'banned') => void
}

const BlogViewToggle: React.FC<BlogViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <Paper bg={'transparent'} mb="lg" py="md">
      <Group justify="space-between">
        <SegmentedControl
          value={statusFilter}
          onChange={(value) =>
            onStatusFilterChange(value as 'all' | 'approved' | 'banned')
          }
          data={[
            { label: 'All Blogs', value: 'all' },
            { label: 'Approved', value: 'approved' },
            { label: 'Banned', value: 'banned' },
          ]}
        />

        <SegmentedControl
          value={viewMode}
          onChange={(value) => onViewModeChange(value as 'list' | 'grid')}
          data={[
            { label: <IconList size={16} />, value: 'list' },
            { label: <IconGridDots size={16} />, value: 'grid' },
          ]}
        />
      </Group>
    </Paper>
  )
}

export default BlogViewToggle

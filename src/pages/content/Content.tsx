import React, { useState } from 'react'
import {
  Grid,
  Group,
  Paper,
  Skeleton,
  Text,
  SegmentedControl,
  Card,
  Center,
} from '@mantine/core'
import { IconList, IconGridDots, IconTrash } from '@tabler/icons-react'
import type { Content } from '@/types/content.type'
import ContentCard from './components/ContentCard'
import ContentList from './components/ContentList'
import { useNavigate } from '@tanstack/react-router'
import PageHeader from '@/components/PageHeader'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { useContent } from '@/services/content.service'
import ActionModal from '@/components/modals/ActionModal'
import { colors } from '@/theme/theme'
import { useCollection } from '@/services/collection.service'
import { useAnalytics } from '@/services/analytics.service'
import DashboardLayout from '@/layout/DashboardLayout'

export const ContentPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [contentType, setContentType] = useState<'all' | 'comic' | 'video'>(
    'all',
  )
  const { decrementCollectionCount } = useCollection()
  const { decrementCount } = useAnalytics()
  const { content, error, isLoading, deleteContent, isDeleting } = useContent()
  const [contentIdToDelete, setContentIdToDelete] = useState<string | null>(
    null,
  )

  const handleView = (content: Content) => {
    navigate({ to: `/content/${content.id}` })
  }

  const handleEdit = (content: Content) => {
    // Open edit modal
    console.log('Edit content:', content)
    navigate({ to: '/content/new-content', search: content })
  }

  const handleDelete = () => {
    if (!contentIdToDelete) return

    deleteContent(contentIdToDelete, {
      onSuccess: async () => {
        setContentIdToDelete(null)

        await Promise.all([
          decrementCollectionCount(contentIdToDelete),

          decrementCount({ field: 'content', amount: 1 }),
        ])
      },
    })
  }

  const navigate = useNavigate()

  const filteredContent =
    contentType === 'all'
      ? content
      : content?.filter((item) => item.type === contentType)

  if (error) {
    return (
      <Center style={{ height: '50vh' }}>
        <Text c="red">Error loading content: {error.message}</Text>
      </Center>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Content Library"
        subtitle="Manage all your comics and videos"
        actionLabel="Add New Content"
        onAction={() => navigate({ to: '/content/new-content' })}
      />

      <Paper bg={'transparent'} mb="lg" py="md">
        <Group justify="space-between">
          <SegmentedControl
            value={contentType}
            onChange={(value) =>
              setContentType(value as 'all' | 'comic' | 'video')
            }
            data={[
              { label: 'All Content', value: 'all' },
              { label: 'Comics', value: 'comic' },
              { label: 'Videos', value: 'video' },
            ]}
          />

          <SegmentedControl
            value={viewMode}
            onChange={(value) => setViewMode(value as 'list' | 'grid')}
            data={[
              { label: <IconList size={16} />, value: 'list' },
              { label: <IconGridDots size={16} />, value: 'grid' },
            ]}
          />
        </Group>
      </Paper>

      {isLoading ? (
        <Grid>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid.Col
              key={index}
              span={
                viewMode === 'grid' ? { base: 12, md: 6, lg: 4, xl: 3 } : 12
              }
            >
              {viewMode === 'grid' ? (
                <Card padding="lg" radius="md" withBorder>
                  <Skeleton height={200} mb="md" />
                  <Skeleton height={20} mb="xs" />
                  <Skeleton height={16} mb="md" />
                  <Skeleton height={16} width="70%" />
                </Card>
              ) : (
                <Paper withBorder p="md">
                  <Group>
                    <Skeleton height={60} width={60} radius="md" />
                    <div style={{ flex: 1 }}>
                      <Skeleton height={20} width="60%" mb="xs" />
                      <Skeleton height={16} width="90%" />
                    </div>
                    <Skeleton height={20} width={80} />
                  </Group>
                </Paper>
              )}
            </Grid.Col>
          ))}
        </Grid>
      ) : filteredContent && filteredContent.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredContent.map((item, index) => (
              <ContentCard
                key={index}
                content={item}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={() => setContentIdToDelete(item.id ?? null)}
              />
            ))}
          </div>
        ) : (
          <ContentList
            content={filteredContent}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={(item) => setContentIdToDelete(item.id ?? null)}
          />
        )
      ) : (
        <Center py="xl">
          <EmptyState
            action={
              <AppButton
                onClick={() => navigate({ to: '/content/new-content' })}
              >
                Add New Content
              </AppButton>
            }
          />
        </Center>
      )}

      <ActionModal
        opened={!!contentIdToDelete}
        onClose={() => setContentIdToDelete(null)}
        title={<span className="text-danger">Confirm Delete</span>}
        icon={
          <div className="bg-danger/10 p-2 rounded-full size-14 flex justify-center items-center">
            <IconTrash size={28} color={colors.danger} />
          </div>
        }
        message={
          <p className="text-info text-sm">
            Are you sure you want to delete this content? This action cannot be
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
          setContentIdToDelete(null)
        }}
      />
    </DashboardLayout>
  )
}

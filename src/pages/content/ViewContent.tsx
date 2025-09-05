import DashboardLayout from '@/layout/DashboardLayout'
import type { Content } from '@/types/content.type'
import {
  Paper,
  Group,
  Text,
  Badge,
  Image,
  Progress,
  Stack,
  Grid,
  Card,
  Avatar,
  Divider,
  ActionIcon,
  Menu,
  Skeleton,
  Center,
} from '@mantine/core'
import {
  IconEye,
  IconBook,
  IconCalendar,
  IconClock,
  IconCrown,
  IconDownload,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconChecklist,
  IconStar,
  IconMessage,
} from '@tabler/icons-react'
import { useState } from 'react'
import { colors, radius } from '@/theme/theme'
import { format } from 'date-fns'
import { useContent } from '@/services/content.service'
import { Back } from '@/components/Back'
import ActionModal from '@/components/modals/ActionModal'
import { useCollection } from '@/services/collection.service'
import { useAnalytics } from '@/services/analytics.service'
import { useNavigate } from '@tanstack/react-router'
import { AppButton } from '@/components/AppButton'

interface ViewContentProps {
  content: Content
  contentId: string
}

function ViewContent({ contentId }: ViewContentProps) {
  const { getContentById } = useContent()
  const { data: content, isLoading: contentLoading } = getContentById(contentId)

  const [imageLoaded, setImageLoaded] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const { getContentReviews } = useContent()
  const { decrementCollectionCount } = useCollection()
  const { decrementCount } = useAnalytics()
  const { deleteContent, isDeleting } = useContent()
  const navigate = useNavigate()

  const { data: reviews, isLoading: loadingReviews } = getContentReviews(
    contentId,
    5,
  )

  const completionRate =
    content?.totalReads! > 0
      ? (content?.totalCompletions! / content?.totalReads!) * 100
      : 0

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Not scheduled'
    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp.seconds * 1000)
    return format(date, 'MMM dd, yyyy • hh:mm a')
  }

  const handleDownload = () => {
    if (content?.type === 'comic' && content?.pdf) {
      window.open(content.pdf, '_blank')
    } else if (content?.type === 'video' && content?.video) {
      window.open(content?.video, '_blank')
    }
  }

  const handleEdit = () => {
    navigate({ to: '/content/new-content', search: content! })
  }

  const handleDelete = () => {
    deleteContent(contentId, {
      onSuccess: async () => {
        await Promise.all([
          decrementCollectionCount(contentId),
          decrementCount({ field: 'content', amount: 1 }),
        ])
        navigate({ to: '..' })
      },
    })
  }

  if (contentLoading) {
    return (
      <DashboardLayout>
        <ContentDetailSkeleton />
      </DashboardLayout>
    )
  }

  // Show error state if content doesn't exist
  if (!content) {
    return (
      <DashboardLayout>
        <Center style={{ height: '60vh' }}>
          <div className="text-center">
            <Text size="xl" fw={600} mb="md">
              Content Not Found
            </Text>
            <Text c="dimmed" mb="lg">
              The content you're looking for doesn't exist or may have been
              removed.
            </Text>
            <AppButton onClick={() => navigate({ to: '/content' })}>
              Back to Content Library
            </AppButton>
          </div>
        </Center>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Group justify="space-between" mb="xl">
        <Back page="contents" />
        <Menu withinPortal position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconDotsVertical size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={16} />}
              onClick={() => handleEdit()}
            >
              Edit Content
            </Menu.Item>
            <Menu.Item
              leftSection={<IconDownload size={16} />}
              onClick={handleDownload}
            >
              Download {content?.type === 'comic' ? 'PDF' : 'Video'}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconTrash size={16} />}
              color="red"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete Content
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="xl">
            <Paper
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <div className="relative">
                    <Image
                      src={content?.img}
                      alt={content?.title}
                      radius="md"
                      className={`transition-opacity duration-300 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      fallbackSrc="https://placehold.co/300x400?text=Cover+Image"
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
                    )}
                    <Badge
                      color={colors.primary}
                      variant="filled"
                      className="absolute top-2 right-2"
                      leftSection={<IconCrown size={14} className="mr-1" />}
                    >
                      {content?.package}
                    </Badge>
                  </div>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Stack gap="md">
                    <div>
                      <Text size="xl" fw={700} className="text-text">
                        {content?.title}
                      </Text>
                      <Text size="sm" c="dimmed" className="mt-1">
                        {content?.collection}
                      </Text>
                    </div>
                    <Text size="sm" className="text-text leading-relaxed">
                      {content?.preview}
                    </Text>
                    <Group gap="xs">
                      {content?.genre.map((genre, index) => (
                        <Badge
                          key={index}
                          variant="light"
                          color="blue"
                          size="sm"
                          className="capitalize"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </Group>
                    <Group gap="md">
                      <Badge
                        variant="light"
                        color={
                          content?.status === 'published' ? 'green' : 'gray'
                        }
                        leftSection={
                          content?.status === 'published' ? (
                            <IconEye size={14} />
                          ) : (
                            <IconClock size={14} />
                          )
                        }
                      >
                        {content?.status}
                      </Badge>
                      <Badge
                        variant="light"
                        color={content?.type === 'comic' ? 'blue' : 'purple'}
                        leftSection={
                          content?.type === 'comic' ? (
                            <IconBook size={14} />
                          ) : (
                            <IconCalendar size={14} />
                          )
                        }
                      >
                        {content?.type}
                      </Badge>
                    </Group>
                    <Divider />
                    <Group gap="xl">
                      <div>
                        <Text size="sm" fw={500} className="text-text">
                          Author
                        </Text>
                        <Text size="sm" c="dimmed" tt={'capitalize'}>
                          {content?.author}
                        </Text>
                      </div>
                      <div>
                        <Text size="sm" fw={500} className="text-text">
                          Pages
                        </Text>
                        <Text size="sm" c="dimmed">
                          {content?.pages} pages
                        </Text>
                      </div>
                      <div>
                        <Text size="sm" fw={500} className="text-text">
                          Uploaded
                        </Text>
                        <Text size="sm" c="dimmed">
                          {formatDate(content?.uploaded)}
                        </Text>
                      </div>
                    </Group>
                    {content?.schedule && (
                      <Group gap="sm">
                        <IconCalendar size={16} className="text-primary" />
                        <Text size="sm" c="dimmed">
                          Scheduled for: {formatDate(content?.schedule)}
                        </Text>
                      </Group>
                    )}
                  </Stack>
                </Grid.Col>
              </Grid>
            </Paper>

            <Card
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Group justify="space-between" mb="md">
                <Text size="lg" fw={600} className="text-text">
                  User Comments & Reviews ({content?.reviews})
                </Text>
              </Group>
              {loadingReviews ? (
                <Stack gap="md">
                  {[1, 2, 3].map((item) => (
                    <Paper key={item} p="md" withBorder>
                      <Group>
                        <Skeleton height={40} circle />
                        <Stack gap={4} style={{ flex: 1 }}>
                          <Skeleton height={16} width="60%" />
                          <Skeleton height={12} width="40%" />
                        </Stack>
                      </Group>
                      <Skeleton height={14} mt="sm" width="90%" />
                      <Skeleton height={14} mt="xs" width="80%" />
                    </Paper>
                  ))}
                </Stack>
              ) : reviews && reviews?.length > 0 ? (
                <Stack gap="md">
                  {reviews?.map((review) => (
                    <Paper
                      key={review.id}
                      p="md"
                      withBorder
                      className="bg-layout"
                    >
                      <Group>
                        <Avatar
                          src={review.image}
                          radius="xl"
                          size="md"
                          color="blue"
                        >
                          {review?.reviewer?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Stack gap={2} style={{ flex: 1 }}>
                          <Group justify="space-between">
                            <Text size="sm" fw={500}>
                              {review.reviewer}
                            </Text>
                            <Group gap={4}>
                              {Array.from({ length: 5 }, (_, index) => (
                                <IconStar
                                  key={index}
                                  size={14}
                                  fill={
                                    index < review?.rating
                                      ? colors.warning
                                      : 'none'
                                  }
                                  color={colors.warning}
                                />
                              ))}
                            </Group>
                          </Group>
                          <Text size="xs" c="dimmed">
                            Rated {review.rating}/5 stars
                          </Text>
                        </Stack>
                      </Group>
                      <Text size="sm" mt="sm" className="text-text">
                        {review?.reviewText}
                      </Text>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Paper p="xl" withBorder className="bg-layout text-center">
                  <IconMessage
                    size={32}
                    className="text-gray-400 mx-auto mb-2"
                  />
                  <Text c="dimmed" size="sm">
                    No reviews yet for this content
                  </Text>
                  <Text c="dimmed" size="xs" mt="xs">
                    Users haven't left any reviews yet.
                  </Text>
                </Paper>
              )}
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="xl">
            <Card
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Text size="lg" fw={600} mb="md" className="text-text">
                Performance Analytics
              </Text>
              <Stack gap="md">
                <Group justify="space-between">
                  <Group gap="sm">
                    <Avatar size="sm" color="blue" variant="light">
                      <IconEye size={16} />
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500}>
                        Total Reads
                      </Text>
                      <Text size="xs" c="dimmed">
                        All readers
                      </Text>
                    </div>
                  </Group>
                  <Text size="lg" fw={700} className="text-primary">
                    {content?.totalReads}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Avatar size="sm" color="green" variant="light">
                      <IconChecklist size={16} />
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500}>
                        Completions
                      </Text>
                      <Text size="xs" c="dimmed">
                        Finished reading
                      </Text>
                    </div>
                  </Group>
                  <Text size="lg" fw={700} className="text-success">
                    {content?.totalCompletions}
                  </Text>
                </Group>
                <div>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={500}>
                      Completion Rate
                    </Text>
                    <Text size="sm" fw={600} className="text-primary">
                      {completionRate.toFixed(1)}%
                    </Text>
                  </Group>
                  <Progress
                    value={completionRate}
                    color={
                      completionRate > 50
                        ? 'green'
                        : completionRate > 25
                          ? 'yellow'
                          : 'red'
                    }
                    size="sm"
                    radius="xl"
                  />
                </div>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Avatar size="sm" color="orange" variant="light">
                      <IconStar size={16} />
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500}>
                        Rating
                      </Text>
                      <Text size="xs" c="dimmed">
                        Average stars
                      </Text>
                    </div>
                  </Group>
                  <Text size="lg" fw={700} className="text-warning">
                    {content?.rating || 0}/5
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Avatar size="sm" color="purple" variant="light">
                      <IconMessage size={16} />
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500}>
                        Reviews
                      </Text>
                      <Text size="xs" c="dimmed">
                        User feedback
                      </Text>
                    </div>
                  </Group>
                  <Text size="lg" fw={700} className="text-secondary">
                    {content?.reviews}
                  </Text>
                </Group>
              </Stack>
            </Card>

            <Card
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Text size="lg" fw={600} mb="md" className="text-text">
                Quick Actions
              </Text>
              <Stack gap="sm">
                <AppButton
                  variant="light"
                  color="blue"
                  leftSection={<IconEdit size={16} />}
                  fullWidth
                  onClick={handleEdit}
                >
                  Edit Content
                </AppButton>
                <AppButton
                  variant="light"
                  color="green"
                  leftSection={<IconDownload size={16} />}
                  fullWidth
                  onClick={handleDownload}
                >
                  Download {content?.type === 'comic' ? 'PDF' : 'Video'}
                </AppButton>
                <AppButton
                  variant="light"
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  fullWidth
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete Content
                </AppButton>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      <ActionModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={<span className="text-danger">Confirm Delete</span>}
        icon={
          <div className="bg-danger/10 p-2 rounded-full size-14 flex justify-center items-center">
            <IconTrash size={28} color={colors.danger} />
          </div>
        }
        message={
          <span className="text-info text-sm">
            Are you sure you want to delete this content? This action cannot be
            undone.
          </span>
        }
        primaryButtonText={'Delete'}
        onPrimaryButtonClick={handleDelete}
        isPrimaryButtonLoading={isDeleting}
        primaryButtonColor={colors.danger}
        secondaryButtonText="Cancel"
        onSecondaryButtonClick={() => {
          setDeleteModalOpen(false)
        }}
      />
    </DashboardLayout>
  )
}

export default ViewContent

const ContentDetailSkeleton: React.FC = () => {
  return (
    <div className="pb-8">
      <Group justify="space-between" mb="xl">
        <Skeleton height={36} width={120} />
        <Skeleton height={36} width={36} circle />
      </Group>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="xl">
            <Paper
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Skeleton height={300} radius="md" />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Stack gap="md">
                    <div>
                      <Skeleton height={32} width="80%" mb="xs" />
                      <Skeleton height={16} width="40%" />
                    </div>
                    <Skeleton height={60} />
                    <Group gap="xs">
                      {[1, 2, 3].map((item) => (
                        <Skeleton key={item} height={24} width={60} />
                      ))}
                    </Group>
                    <Group gap="md">
                      <Skeleton height={24} width={100} />
                      <Skeleton height={24} width={80} />
                    </Group>
                    <Divider />
                    <Group gap="xl">
                      <div>
                        <Skeleton height={16} width={60} mb="xs" />
                        <Skeleton height={14} width={80} />
                      </div>
                      <div>
                        <Skeleton height={16} width={50} mb="xs" />
                        <Skeleton height={14} width={70} />
                      </div>
                      <div>
                        <Skeleton height={16} width={70} mb="xs" />
                        <Skeleton height={14} width={100} />
                      </div>
                    </Group>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Paper>

            <Card
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Skeleton height={24} width={200} mb="md" />
              <Stack gap="md">
                {[1, 2, 3].map((item) => (
                  <Paper key={item} p="md" withBorder>
                    <Group>
                      <Skeleton height={40} circle />
                      <Stack gap={4} style={{ flex: 1 }}>
                        <Skeleton height={16} width="60%" />
                        <Skeleton height={12} width="40%" />
                      </Stack>
                    </Group>
                    <Skeleton height={14} mt="sm" width="90%" />
                    <Skeleton height={14} mt="xs" width="80%" />
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="xl">
            <Card
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Skeleton height={24} width={180} mb="md" />
              <Stack gap="md">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Group key={item} justify="space-between">
                    <Group gap="sm">
                      <Skeleton height={32} width={32} radius="sm" />
                      <div>
                        <Skeleton height={16} width={80} mb="xs" />
                        <Skeleton height={12} width={60} />
                      </div>
                    </Group>
                    <Skeleton height={24} width={40} />
                  </Group>
                ))}
                <div>
                  <Group justify="space-between" mb="xs">
                    <Skeleton height={16} width={100} />
                    <Skeleton height={16} width={40} />
                  </Group>
                  <Skeleton height={8} radius="xl" />
                </div>
              </Stack>
            </Card>

            <Card
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Skeleton height={24} width={120} mb="md" />
              <Stack gap="sm">
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} height={36} radius="md" />
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  )
}

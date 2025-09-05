import {
  Grid,
  Group,
  Progress,
  Text,
  RingProgress,
  Center,
  Paper,
  Skeleton,
} from '@mantine/core'
import {
  IconBook,
  IconUsers,
  IconChecklist,
  IconEye,
} from '@tabler/icons-react'
import { useAnalytics } from '@/services/analytics.service'
import { colors } from '@/theme/theme'

const AnalyticsDashboard = () => {
  const { analytics, error, isLoading } = useAnalytics()

  if (error) {
    return <div>Error loading analytics analytics</div>
  }

  // Calculate derived metrics
  const completionRate = analytics
    ? (analytics.completion / (analytics.reads || 1)) * 100
    : 0
  const readsPerUser = analytics ? analytics.reads / (analytics.users || 1) : 0
  const contentCompletionRate = analytics
    ? (analytics.completion / analytics.content / (analytics.users || 1)) * 100
    : 0

  return (
    <div className="">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          SM-Comics Analytics Dashboard
        </h1>
        <p className="text-gray-600 text-sm">
          Real-time performance metrics for your comics platform
        </p>
      </header>

      <Grid gutter="lg">
        {/* Users Card */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            isLoading={isLoading}
            title="Total Users"
            value={analytics?.users}
            icon={<IconUsers size={20} />}
            color="blue"
            description="Registered users on the platform"
          />
        </Grid.Col>

        {/* Content Card */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            isLoading={isLoading}
            title="Total Content"
            value={analytics?.content}
            icon={<IconBook size={20} />}
            color="green"
            description="Comics available in the app"
          />
        </Grid.Col>

        {/* Reads Card */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            isLoading={isLoading}
            title="Total Reads"
            value={analytics?.reads}
            icon={<IconEye size={20} />}
            color="orange"
            description="Number of comic openings"
          />
        </Grid.Col>

        {/* Completions Card */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            isLoading={isLoading}
            title="Total Completions"
            value={analytics?.completion}
            icon={<IconChecklist size={20} />}
            color="violet"
            description="Completed comic readings"
          />
        </Grid.Col>

        {/* Completion Rate Ring Chart */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="lg">
            <div className="mb-4">
              <Text fw={500} size="lg">
                Completion Rate
              </Text>
              <Text c="dimmed" size="sm">
                Percentage of reads that result in completions
              </Text>
            </div>

            {isLoading ? (
              <Skeleton height={200} circle />
            ) : (
              <Center>
                <RingProgress
                  size={140}
                  thickness={10}
                  roundCaps
                  sections={[
                    {
                      value: completionRate,
                      color:
                        completionRate > 75
                          ? colors.primary
                          : completionRate > 50
                            ? 'yellow'
                            : 'orange',
                      tooltip: `${completionRate.toFixed(1)}%`,
                    },
                  ]}
                  label={
                    <Center>
                      <div className="text-center">
                        <Text fw={700} size="md">
                          {completionRate.toFixed(1)}%
                        </Text>
                        <Text c="dimmed" size="10px">
                          Completion Rate
                        </Text>
                      </div>
                    </Center>
                  }
                />
              </Center>
            )}
          </Paper>
        </Grid.Col>

        {/* Engagement Metrics */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="lg" h={'100%'}>
            <div className="mb-6 ">
              <Text fw={500} size="lg">
                Engagement Metrics
              </Text>
              <Text c="dimmed" size="sm">
                How users interact with your content
              </Text>
            </div>

            {isLoading ? (
              <>
                <Skeleton height={16} mt="md" />
                <Skeleton height={16} mt="md" />
              </>
            ) : (
              <>
                <div className="mb-4">
                  <Group justify="apart" mb="xs">
                    <Text size="sm">Reads per User</Text>
                    <Text fw={500} size="sm">
                      {readsPerUser.toFixed(1)}
                    </Text>
                  </Group>
                  <Progress
                    value={Math.min(readsPerUser * 10, 100)}
                    color="blue"
                    size="lg"
                    bg={'var(--color-background)'}
                  />
                </div>

                <div>
                  <Group justify="apart" mb="xs">
                    <Text size="sm">Content Completion Ratio</Text>
                    <Text fw={500} size="sm">
                      {contentCompletionRate.toFixed(1)}%
                    </Text>
                  </Group>
                  <Progress
                    value={contentCompletionRate}
                    color="green"
                    size="lg"
                    bg={'var(--color-background)'}
                  />
                </div>
              </>
            )}
          </Paper>
        </Grid.Col>

        {/* Summary Stats */}
        <Grid.Col span={12}>
          <Paper withBorder p="md" radius="lg">
            <div className="mb-4">
              <Text fw={500} size="lg">
                Performance Summary
              </Text>
              <Text c="dimmed" size="sm">
                Key metrics at a glance
              </Text>
            </div>

            {isLoading ? (
              <Grid>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <Skeleton height={80} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <Skeleton height={80} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <Skeleton height={80} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <Skeleton height={80} />
                </Grid.Col>
              </Grid>
            ) : (
              <Grid>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <div className="text-center p-4 rounded-lg bg-blue-50/50 border border-gray-200">
                    <Text fw={700} size="xl" className="text-blue-700">
                      {analytics?.users}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Active Users
                    </Text>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <div className="text-center p-4 rounded-lg bg-green-50/50 border border-gray-200">
                    <Text fw={700} size="xl" className="text-green-700">
                      {analytics?.content}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Content Pieces
                    </Text>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <div className="text-center p-4 rounded-lg bg-orange-50/50 border border-gray-200">
                    <Text fw={700} size="xl" className="text-orange-700">
                      {analytics?.reads}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Total Reads
                    </Text>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <div className="text-center p-4 rounded-lg bg-violet-50/50 border border-gray-200">
                    <Text fw={700} size="xl" className="text-violet-700">
                      {analytics?.completion}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Completions
                    </Text>
                  </div>
                </Grid.Col>
              </Grid>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  )
}

// Reusable stat card component
const StatCard = ({
  isLoading,
  title,
  value,
  icon,
  color,
  description,
}: {
  isLoading: boolean
  title: string
  value?: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'orange' | 'violet'
  description: string
}) => {
  const colorMap = {
    blue: 'text-blue-700 bg-blue-100',
    green: 'text-green-700 bg-green-100',
    orange: 'text-orange-700 bg-orange-100',
    violet: 'text-violet-700 bg-violet-100',
  }

  return (
    <Paper withBorder p="md" radius="lg">
      <Group justify="apart" align="center" mb="xs">
        <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
          {title}
        </Text>
        <div className={`p-2 rounded-full ${colorMap[color]}`}>{icon}</div>
      </Group>

      {isLoading ? (
        <Skeleton height={28} width="60%" mb="sm" />
      ) : (
        <Text
          fw={700}
          size="xl"
          className={`mb-2 ${colorMap[color].split(' ')[0]}`}
        >
          {value?.toLocaleString()}
        </Text>
      )}

      <Text c="dimmed" size="xs">
        {description}
      </Text>
    </Paper>
  )
}

export default AnalyticsDashboard

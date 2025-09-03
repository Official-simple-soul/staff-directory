import DashboardLayout from '@/layout/DashboardLayout'
import type { User } from '@/types/user.type'
import {
  Paper,
  Group,
  Text,
  Avatar,
  Badge,
  Stack,
  Grid,
  Card,
  Divider,
  Modal,
  Select,
} from '@mantine/core'
import {
  IconCrown,
  IconCoin,
  IconWorld,
  IconUser,
  IconMail,
  IconPhone,
  IconEdit,
  IconShield,
  IconChartBar,
} from '@tabler/icons-react'
import { colors, radius } from '@/theme/theme'
import { format } from 'date-fns'
import { safeToDate } from '@/utils/helper'
import { useState } from 'react'
import { AppButton } from '@/components/AppButton'
import { Back } from '@/components/Back'
import { useUser } from '@/services/user.service'
import { useNavigate } from '@tanstack/react-router'

interface ViewUserProps {
  user: User | null
}

function ViewUser({ user }: ViewUserProps) {
  if (!user) return
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(user?.role || 'user')
  const { updateUser, isUpdating } = useUser()
  const lastLoginDate = safeToDate(user?.lastLogin)
  const joinDate = safeToDate(user?.createdAt) || safeToDate(user?.subDate)
  const subscriptionExpiry = safeToDate(user?.subExpiry)
  const navigate = useNavigate()

  const isActive = lastLoginDate
    ? new Date().getTime() - lastLoginDate.getTime() < 30 * 24 * 60 * 60 * 1000
    : false

  const getPackageColor = (packageSub: string) => {
    switch (packageSub?.toLowerCase()) {
      case 'premium':
      case 'gold':
        return colors.warning
      case 'silver':
        return colors.info
      case 'bronze':
        return colors.secondary
      default:
        return colors.primary
    }
  }

  const handleRoleUpdate = () => {
    console.log('Updating role to:', selectedRole)
    const payload = {
      role: selectedRole,
    }
    updateUser(
      { id: user?.id, data: payload },
      {
        onSuccess() {
          setEditRoleModalOpen(false)
          navigate({ to: '..' })
        },
      },
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <Back />

        <AppButton
          variant="light"
          leftSection={<IconEdit size={16} />}
          onClick={() => setEditRoleModalOpen(true)}
        >
          Edit Role
        </AppButton>
      </Group>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="xl">
            {/* Profile Card */}
            <Paper
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm text-center"
            >
              <Avatar
                src={user.photoURL}
                size="xl"
                radius="xl"
                mx="auto"
                mb="md"
                color="blue"
              >
                {user.name?.charAt(0).toUpperCase() ||
                  user.displayName?.charAt(0).toUpperCase() ||
                  'U'}
              </Avatar>

              <Text fw={700} size="lg" className="text-text mb-2">
                {user.name || user.displayName || 'Unknown User'}
              </Text>

              <Text size="sm" c="dimmed" mb="md">
                {user.email || 'No email provided'}
              </Text>

              <Group justify="center" mb="md">
                <Badge
                  variant="light"
                  color={isActive ? 'green' : 'gray'}
                  size="lg"
                >
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>

                <Badge
                  variant="light"
                  color={getPackageColor(user.packageSub)}
                  leftSection={<IconCrown size={14} />}
                  size="lg"
                >
                  {user.packageSub || 'No subscription'}
                </Badge>
              </Group>

              <Divider my="md" />

              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    User ID
                  </Text>
                  <Text size="sm" fw={500} className="text-text">
                    {user.id?.substring(0, 8)}...
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Customer Code
                  </Text>
                  <Text size="sm" fw={500} className="text-text">
                    {user.customer_code || 'N/A'}
                  </Text>
                </Group>
              </Stack>
            </Paper>

            {/* Contact Info Card */}
            <Paper
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Text fw={600} size="lg" mb="md" className="text-text">
                Contact Information
              </Text>

              <Stack gap="md">
                <Group gap="sm">
                  <IconMail size={18} color={colors.info} />
                  <Text size="sm">{user.email || 'No email'}</Text>
                </Group>

                {user.phone && (
                  <Group gap="sm">
                    <IconPhone size={18} color={colors.info} />
                    <Text size="sm">{user.phone}</Text>
                  </Group>
                )}

                {user.country && (
                  <Group gap="sm">
                    <IconWorld size={18} color={colors.info} />
                    <Text size="sm">{user.country}</Text>
                  </Group>
                )}

                {user.gender && (
                  <Group gap="sm">
                    <IconUser size={18} color={colors.info} />
                    <Text size="sm" tt="capitalize">
                      {user.gender}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="xl">
            <Paper
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Text fw={600} size="lg" mb="md" className="text-text">
                Account Overview
              </Text>

              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius="md" className="text-center">
                    <IconCoin
                      size={32}
                      color={colors.warning}
                      className="mx-auto mb-2"
                    />
                    <Text fw={700} size="xl" c={colors.warning}>
                      {user.coins?.toLocaleString() || 0}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Total Coins
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius="md" className="text-center">
                    <IconChartBar
                      size={32}
                      color={colors.primary}
                      className="mx-auto mb-2"
                    />
                    <Text fw={700} size="xl" c={colors.primary}>
                      {user.streaks || 0}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Login Streaks
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Group justify="space-between" mb="md">
                <Text fw={600} size="lg" className="text-text">
                  Subscription Details
                </Text>
                <Badge
                  variant="light"
                  color={getPackageColor(user.packageSub)}
                  size="lg"
                >
                  {user.packageSub || 'No subscription'}
                </Badge>
              </Group>

              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Subscription Code
                  </Text>
                  <Text size="sm" fw={500} className="text-text">
                    {user.subscription_code || 'N/A'}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Start Date
                  </Text>
                  <Text size="sm" fw={500} className="text-text">
                    {joinDate ? format(joinDate, 'MMM dd, yyyy') : 'N/A'}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Expiry Date
                  </Text>
                  <Text size="sm" fw={500} c={getPackageColor(user.packageSub)}>
                    {subscriptionExpiry
                      ? format(subscriptionExpiry, 'MMM dd, yyyy')
                      : 'Never subscribed'}
                  </Text>
                </Group>

                {user.referral_code && (
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Referral Code
                    </Text>
                    <Text size="sm" fw={500} className="text-text">
                      {user.referral_code}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Paper>

            <Paper
              p={{ base: 'md', md: 'xl' }}
              radius={radius.app}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Text fw={600} size="lg" mb="md" className="text-text">
                Activity & Security
              </Text>

              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Last Login
                  </Text>
                  <Text size="sm" fw={500} className="text-text">
                    {lastLoginDate
                      ? format(lastLoginDate, 'MMM dd, yyyy • HH:mm')
                      : 'Never'}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Account Role
                  </Text>
                  <Badge
                    variant="light"
                    color={
                      user.role === 'admin'
                        ? 'red'
                        : user.role === 'moderator'
                          ? 'blue'
                          : 'gray'
                    }
                    leftSection={<IconShield size={12} />}
                  >
                    {user.role || 'user'}
                  </Badge>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Account Created
                  </Text>
                  <Text size="sm" fw={500} className="text-text">
                    {joinDate ? format(joinDate, 'MMM dd, yyyy') : 'Unknown'}
                  </Text>
                </Group>

                {user.lastRewardedDate && safeToDate(user.lastRewardedDate) && (
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Last Rewarded
                    </Text>
                    <Text size="sm" fw={500} className="text-text">
                      {format(
                        safeToDate(user.lastRewardedDate) as Date,
                        'MMM dd, yyyy',
                      )}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>

      <Modal
        opened={editRoleModalOpen}
        onClose={() => setEditRoleModalOpen(false)}
        title="Edit User Role"
        centered
        radius={radius.app}
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Change the role for {user.name || user.displayName}
          </Text>

          <Select
            label="User Role"
            value={selectedRole}
            onChange={(value) =>
              setSelectedRole(value as 'user' | 'moderator' | 'admin')
            }
            data={[
              { value: 'user', label: 'User' },
              { value: 'moderator', label: 'Moderator' },
              { value: 'admin', label: 'Admin' },
            ]}
          />

          <Group justify="flex-end" mt="md">
            <AppButton
              variant="default"
              onClick={() => setEditRoleModalOpen(false)}
              leftSection={<></>}
              disabled={isUpdating}
            >
              Cancel
            </AppButton>
            <AppButton
              onClick={handleRoleUpdate}
              loading={isUpdating}
              disabled={isUpdating}
            >
              Update Role
            </AppButton>
          </Group>
        </Stack>
      </Modal>
    </DashboardLayout>
  )
}

export default ViewUser

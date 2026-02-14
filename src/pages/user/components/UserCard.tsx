import { colors } from '@/theme/theme'
import type { User } from '@/types/user.type'
import { safeToDate } from '@/utils/helper'
import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Group,
  Menu,
  Stack,
  Text,
} from '@mantine/core'
import {
  IconCoin,
  IconCrown,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
  IconUser,
  IconWorld,
} from '@tabler/icons-react'
import { format } from 'date-fns'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onView: (user: User) => void
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onView,
}) => {
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

  return (
    <Card
      padding="lg"
      radius="lg"
      withBorder
      className="h-full bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      {/* Header with Avatar and Basic Info */}
      <Group align="flex-start" mb="md">
        <Avatar
          src={user.photoURL}
          size="lg"
          radius="xl"
          color="blue"
          className="flex-shrink-0"
        >
          {user.name?.charAt(0).toUpperCase() ||
            user.displayName?.charAt(0).toUpperCase()}
        </Avatar>

        <div className="flex-1 min-w-0">
          <Text fw={700} size="lg" className="text-text truncate">
            {user.name || user.displayName}
          </Text>
          <Text size="sm" c="dimmed" className="truncate">
            {user.email}
          </Text>

          <Group gap="sm" mt={4}>
            <Badge
              variant="light"
              color={getPackageColor(user.subscription?.plan || '')}
              leftSection={<IconCrown size={12} />}
              size="sm"
            >
              {user.subscription?.plan || 'None'}
            </Badge>
          </Group>
        </div>

        <Menu withinPortal position="bottom-end" shadow="sm">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconDotsVertical size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={14} />}
              onClick={() => onView(user)}
            >
              View Profile
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() => onEdit(user)}
            >
              Edit User
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconTrash size={14} />}
              color="red"
              onClick={() => onDelete(user)}
            >
              Delete User
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      {/* Stats Section */}
      <Stack gap="sm" mb="md">
        <Group justify="space-between">
          <Group gap={4}>
            <IconCoin size={16} color={colors.warning} />
            <Text size="sm" fw={600}>
              Coins
            </Text>
          </Group>
          <Text size="lg" fw={700} c={colors.warning}>
            {user.coins?.toLocaleString() || 0}
          </Text>
        </Group>

        <Group justify="space-between">
          <Group gap={4}>
            <IconUser size={16} color={colors.primary} />
            <Text size="sm" fw={600}>
              Role
            </Text>
          </Group>
          <Badge variant="light" color="blue" size="sm">
            {user.role || 'user'}
          </Badge>
        </Group>

        <Group justify="space-between">
          <Group gap={4}>
            <IconWorld size={16} color={colors.info} />
            <Text size="sm" fw={600}>
              Location
            </Text>
          </Group>
          <Text size="sm" c="dimmed">
            {user.country || 'Nigeria'}
          </Text>
        </Group>
      </Stack>

      <div className="border-t pt-3">
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            Last active
          </Text>
          <Text size="xs" fw={500} c={colors.info}>
            {(() => {
              const lastLoginDate = safeToDate(user.lastLogin)
              return lastLoginDate
                ? format(lastLoginDate, 'MMM dd, yyyy')
                : 'Long time'
            })()}
          </Text>
        </Group>

        {/* <Group justify="space-between" mt={4}>
          <Text size="xs" c="dimmed">
            Subscription expiry
          </Text>
          <Text
            size="xs"
            fw={500}
            c={getPackageColor(user.subscription?.plan || '')}
          >
            {user?.subscription?.nextPaymentDate
              ? format(
                  new Date(user.subscription.nextPaymentDate),
                  'MMM dd, yyyy',
                )
              : '-'}
          </Text>
        </Group> */}
      </div>
    </Card>
  )
}

export default UserCard

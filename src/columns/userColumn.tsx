import type { ColumnDefinition } from '@/types/global.types'
import type { User } from '@/types/user.type'
import { Badge, Box, Group, Avatar, Flex } from '@mantine/core'
import {
  IconCrown,
  IconCoin,
  IconUser,
  IconClock,
  IconWorld,
} from '@tabler/icons-react'
import { TableMenu, TableText } from './Reuseable'
import { colors } from '@/theme/theme'
import { format } from 'date-fns'
import { safeToDate } from '@/utils/helper'

const getPackageColor = (packageSub: string) => {
  switch (packageSub?.toLowerCase()) {
    case 'premium':
    case 'gold':
      return { color: colors.warning, bg: `${colors.warning}20` }
    case 'silver':
      return { color: colors.info, bg: `${colors.info}20` }
    case 'bronze':
      return { color: colors.secondary, bg: `${colors.secondary}20` }
    default:
      return { color: colors.primary, bg: `${colors.primary}20` }
  }
}

const getRoleColor = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return { color: colors.primary, bg: colors.layout }
    case 'moderator':
      return { color: colors.warning, bg: `${colors.warning}20` }
    default:
      return { color: colors.info, bg: colors.infoLight }
  }
}

const isUserActive = (lastLogin: any): boolean => {
  const lastLoginDate = safeToDate(lastLogin)
  if (!lastLoginDate) return false

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return lastLoginDate.getTime() > thirtyDaysAgo.getTime()
}

export const userColumns = (
  handleView: (user: User) => void,
  handleEdit: (user: User) => void,
  confirmDeleteUser: (user: User) => void,
): ColumnDefinition<User>[] => {
  return [
    {
      accessor: 'user',
      header: 'User',
      width: 280,
      render: (row: User) => (
        <Group wrap="nowrap">
          <Avatar
            src={row.photoURL}
            size="md"
            radius="xl"
            color="blue"
            className="flex-shrink-0"
          >
            {row.name?.charAt(0).toUpperCase() ||
              row.displayName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box style={{ minWidth: 0 }}>
            <TableText fw={600}>{row.name || row.displayName}</TableText>
            <TableText size="xs" c="dimmed" className="truncate">
              {row.email}
            </TableText>
          </Box>
        </Group>
      ),
    },
    {
      accessor: 'role',
      header: 'Role',
      render: (row: User) => {
        const { color, bg } = getRoleColor(row.role)

        return (
          <Badge
            variant="light"
            leftSection={<IconUser size={12} />}
            styles={{
              root: {
                backgroundColor: bg,
                color: color,
                fontWeight: 600,
                textTransform: 'capitalize',
              },
            }}
          >
            {row.role || 'user'}
          </Badge>
        )
      },
    },
    {
      accessor: 'subscription',
      header: 'Subscription',
      render: (row: User) => {
        const { color, bg } = getPackageColor(row.packageSub)
        return (
          <Badge
            variant="light"
            leftSection={<IconCrown size={12} />}
            size="md"
            styles={{
              root: {
                backgroundColor: bg,
                color: color,
                fontWeight: 600,
                textTransform: 'capitalize',
              },
            }}
          >
            {row.packageSub}
          </Badge>
        )
      },
    },
    {
      accessor: 'coins',
      header: 'Coins',
      render: (row: User) => (
        <Group gap={4}>
          <IconCoin size={16} color={colors.primary} />
          <TableText fw={600} c={colors.primary}>
            {row.coins?.toLocaleString() || 0}
          </TableText>
        </Group>
      ),
    },
    {
      accessor: 'country',
      header: 'Location',
      render: (row: User) => (
        <Flex gap={4} align={'center'}>
          <IconWorld size={14} color={colors.info} />
          <TableText>{row.country || 'Nigeria'}</TableText>
        </Flex>
      ),
    },
    {
      accessor: 'lastLogin',
      header: 'Last Active',
      render: (row: User) => {
        const lastLoginDate = safeToDate(row.lastLogin)
        const active = isUserActive(row.lastLogin)

        return (
          <Flex gap={4} align={'center'}>
            <IconClock
              size={14}
              color={active ? colors.success : colors.info}
            />
            <TableText size="sm" c={active ? undefined : 'dimmed'}>
              {lastLoginDate
                ? format(lastLoginDate, 'MMM dd, yyyy')
                : 'Long Time'}
            </TableText>
          </Flex>
        )
      },
    },
    {
      accessor: 'action',
      header: 'Action',
      align: 'center',
      render: (row: User) => (
        <TableMenu
          type="user"
          onView={() => handleView(row)}
          onEdit={() => handleEdit(row)}
          onDelete={() => confirmDeleteUser(row)}
          row={row}
        />
      ),
    },
  ]
}

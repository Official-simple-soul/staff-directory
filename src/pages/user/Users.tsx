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
import {
  IconList,
  IconGridDots,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react'
import type { User } from '@/types/user.type'
import UserCard from './components/UserCard'
import UserList from './components/UserList'
import { useNavigate } from '@tanstack/react-router'
import PageHeader from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { useUser } from '@/services/user.service'
import ActionModal from '@/components/modals/ActionModal'
import { colors } from '@/theme/theme'
import { safeToDate } from '@/utils/helper'
import DashboardLayout from '@/layout/DashboardLayout'

const isUserActive = (user: User): boolean => {
  const lastLoginDate = safeToDate(user.lastLogin)
  if (!lastLoginDate) return false

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return lastLoginDate.getTime() > thirtyDaysAgo.getTime()
}

export const UsersPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [userType, setUserType] = useState<
    'all' | 'active' | 'inactive' | 'admin' | 'moderator'
  >('all')
  const { users, error, isLoading, isDeleting } = useUser()
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleView = (user: User) => {
    navigate({ to: `/users/${user.id}` })
  }

  const handleEdit = (user: User) => {
    alert(`Open user details to edit ${user.displayName}`)
  }

  const handleDelete = () => {
    if (!userIdToDelete) return
    // deleteUser(userIdToDelete)
    // setUserIdToDelete(null)
    alert(`Deleting user is not allowed for now`)
  }

  const filteredUsers = users.filter((user) => {
    switch (userType) {
      case 'all':
        return true
      case 'admin':
        return user.role?.toLowerCase() === 'admin'
      case 'moderator':
        return user.role?.toLowerCase() === 'moderator'
      case 'active':
        return isUserActive(user)
      case 'inactive':
        return !isUserActive(user)
      default:
        return true
    }
  })

  if (error) {
    return (
      <Center style={{ height: '50vh' }}>
        <Text c="red">Error loading users: {error.message}</Text>
      </Center>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="User Management"
        subtitle="Manage all your platform users"
      />

      <Paper bg={'transparent'} mb="lg" py="md">
        <Group justify="space-between">
          <SegmentedControl
            value={userType}
            onChange={(value) =>
              setUserType(value as 'all' | 'active' | 'inactive')
            }
            data={[
              { label: 'All Users', value: 'all' },
              { label: 'Active Users', value: 'active' },
              { label: 'Inactive Users', value: 'inactive' },
              { label: 'Moderator', value: 'moderator' },
              { label: 'Admin', value: 'admin' },
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
                  <Skeleton height={120} mb="md" />
                  <Skeleton height={20} mb="xs" />
                  <Skeleton height={16} mb="md" />
                  <Skeleton height={16} width="70%" />
                </Card>
              ) : (
                <Paper withBorder p="md">
                  <Group>
                    <Skeleton height={40} circle />
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
      ) : filteredUsers && filteredUsers.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={() => setUserIdToDelete(user.id)}
              />
            ))}
          </div>
        ) : (
          <UserList
            users={filteredUsers}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={(user) => setUserIdToDelete(user.id)}
          />
        )
      ) : (
        <Center py="xl">
          <EmptyState
            icon={<IconUsers size={48} className="text-gray-400" />}
            title="No Users Found"
            description={
              userType !== 'all'
                ? `No ${userType} users match your criteria.`
                : 'Get started by adding your first user.'
            }
            // action={
            //   <AppButton onClick={() => navigate({ to: '/users' })}>
            //     Add New User
            //   </AppButton>
            // }
          />
        </Center>
      )}

      <ActionModal
        opened={!!userIdToDelete}
        onClose={() => setUserIdToDelete(null)}
        title={<span className="text-danger">Confirm Delete</span>}
        icon={
          <div className="bg-danger/10 p-2 rounded-full size-14 flex justify-center items-center">
            <IconTrash size={28} color={colors.danger} />
          </div>
        }
        message={
          <p className="text-info text-sm">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
        }
        primaryButtonText={'Delete'}
        onPrimaryButtonClick={handleDelete}
        isPrimaryButtonLoading={isDeleting}
        primaryButtonColor={colors.danger}
        secondaryButtonText="Cancel"
        onSecondaryButtonClick={() => setUserIdToDelete(null)}
      />
    </DashboardLayout>
  )
}

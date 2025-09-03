import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { User, UpdateUserDTO } from '@/types/user.type'
import { notifications } from '@mantine/notifications'
import { userApi } from '@/api/user.api'

export const useUser = () => {
  const queryClient = useQueryClient()

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Fetch user by ID
  const useUserById = (id: string) => {
    return useQuery<User | null>({
      queryKey: ['user', id],
      queryFn: () => userApi.getUserById(id),
      enabled: !!id,
      staleTime: 1 * 60 * 1000, // 1 minute
    })
  }

  // Create user mutation
  //   const createUserMutation = useMutation({
  //     mutationFn: userApi.createUser,
  //     onSuccess: (id) => {
  //       queryClient.invalidateQueries({ queryKey: ['users'] })
  //       notifications.show({
  //         title: 'Success',
  //         message: 'User created successfully',
  //         color: 'green',
  //       })
  //       return id
  //     },
  //     onError: (error: Error) => {
  //       notifications.show({
  //         title: 'Error',
  //         message: `Failed to create user: ${error.message}`,
  //         color: 'red',
  //       })
  //     },
  //   })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
      userApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      notifications.show({
        title: 'Success',
        message: 'User updated successfully',
        color: 'green',
      })
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: `Failed to update user: ${error.message}`,
        color: 'red',
      })
    },
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      notifications.show({
        title: 'Success',
        message: 'User deleted successfully',
        color: 'green',
      })
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: `Failed to delete user: ${error.message}`,
        color: 'red',
      })
    },
  })

  // Update coins mutation
  const updateUserCoinsMutation = useMutation({
    mutationFn: ({ id, coins }: { id: string; coins: number }) =>
      userApi.updateUserCoins(id, coins),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      notifications.show({
        title: 'Success',
        message: 'User coins updated successfully',
        color: 'green',
      })
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: `Failed to update user coins: ${error.message}`,
        color: 'red',
      })
    },
  })

  // Update subscription mutation
  const updateUserSubscriptionMutation = useMutation({
    mutationFn: ({
      id,
      subscriptionData,
    }: {
      id: string
      subscriptionData: {
        packageSub: string
        subDate: string
        subExpiry: string
        subscription_code: string
      }
    }) => userApi.updateUserSubscription(id, subscriptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      notifications.show({
        title: 'Success',
        message: 'User subscription updated successfully',
        color: 'green',
      })
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: `Failed to update user subscription: ${error.message}`,
        color: 'red',
      })
    },
  })

  // Get users by email
  const getUserByEmail = async (email: string): Promise<User | null> => {
    return userApi.getUserByEmail(email)
  }

  // Get users by role
  const getUsersByRole = async (role: string): Promise<User[]> => {
    return userApi.getUsersByRole(role)
  }

  // Get users by package
  const getUsersByPackage = async (packageSub: string): Promise<User[]> => {
    return userApi.getUsersByPackage(packageSub)
  }

  // Search users
  const searchUsers = async (queryText: string): Promise<User[]> => {
    return userApi.searchUsers(queryText)
  }

  // Get active users
  const getActiveUsers = async (): Promise<User[]> => {
    return userApi.getActiveUsers()
  }

  // Get users with low coins
  const getUsersWithLowCoins = async (
    threshold: number = 10,
  ): Promise<User[]> => {
    return userApi.getUsersWithLowCoins(threshold)
  }

  // Get users by country
  const getUsersByCountry = async (country: string): Promise<User[]> => {
    return userApi.getUsersByCountry(country)
  }

  return {
    // Data
    users,
    isLoading,
    error,
    refetch,

    // Mutations
    // createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutate,
    updateUserCoins: updateUserCoinsMutation.mutateAsync,
    updateUserSubscription: updateUserSubscriptionMutation.mutateAsync,

    // Queries
    useUserById,
    getUsersByRole,
    getUsersByPackage,
    searchUsers,
    getActiveUsers,
    getUsersWithLowCoins,
    getUsersByCountry,
    getUserByEmail,

    // Loading states
    // isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isUpdatingCoins: updateUserCoinsMutation.isPending,
    isUpdatingSubscription: updateUserSubscriptionMutation.isPending,
  }
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { analyticsApi, type AnalyticsSnapshot } from '@/api/analytics.api'

export const useAnalytics = () => {
  const queryClient = useQueryClient()

  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery<AnalyticsSnapshot | null>({
    queryKey: ['analytics'],
    queryFn: analyticsApi.getLatestAnalytics,
    staleTime: 2 * 60 * 1000,
  })

  const incrementCount = useMutation({
    mutationFn: ({
      field,
      amount,
    }: {
      field: keyof Pick<
        AnalyticsSnapshot,
        'completion' | 'content' | 'reads' | 'users' | 'views'
      >
      amount?: number
    }) => analyticsApi.incrementCount(field, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  const decrementCount = useMutation({
    mutationFn: ({
      field,
      amount,
    }: {
      field: keyof Pick<
        AnalyticsSnapshot,
        'completion' | 'content' | 'reads' | 'users' | 'views'
      >
      amount?: number
    }) => analyticsApi.decrementCount(field, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  return {
    analytics,
    isLoading,
    error,
    incrementCount: incrementCount.mutateAsync,
    decrementCount: decrementCount.mutateAsync,
  }
}

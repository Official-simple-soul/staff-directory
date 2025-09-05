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

  const incrementAnalyticsCount = useMutation({
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

  const decrementAnalyticsCount = useMutation({
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
    incrementAnalyticsCount: incrementAnalyticsCount.mutateAsync,
    decrementAnalyticsCount: decrementAnalyticsCount.mutateAsync,
  }
}

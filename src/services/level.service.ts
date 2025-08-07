import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateGradeLevel, UpdateGradeLevel } from '@/types/level.type'
import { levelApi } from '@/api/level.api'

export const useLevels = () => {
  const queryClient = useQueryClient()

  // List all levels
  const listLevels = useQuery({
    queryKey: ['grade-levels'],
    queryFn: levelApi.getAll,
  })

  // Get single level
  const getLevelQuery = (id: string) =>
    useQuery({
      queryKey: ['grade-levels', id],
      queryFn: () => levelApi.getById(id),
      enabled: !!id,
    })

  // Create level mutation
  const createLevel = useMutation({
    mutationFn: (data: CreateGradeLevel) => levelApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] })
    },
  })

  // Update level mutation
  const updateLevel = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGradeLevel }) =>
      levelApi.update(id, data),
    onSuccess: (updatedLevel) => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] })
      queryClient.invalidateQueries({
        queryKey: ['grade-levels', updatedLevel.id],
      })
    },
  })

  // Delete level mutation
  const deleteLevel = useMutation({
    mutationFn: (id: string) => levelApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] })
    },
  })

  return {
    listLevels,
    getLevel: {
      query: getLevelQuery,
    },
    createLevel,
    updateLevel,
    deleteLevel,
  }
}

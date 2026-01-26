// src/services/category.service.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Category, UpdateCategoryDTO } from '@/types/category.type'
import { categoryApi } from '@/api/category.api'

export const useCategory = () => {
  const queryClient = useQueryClient()

  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories,
    staleTime: 5 * 60 * 1000,
  })

  const createCategoryMutation = useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDTO }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories', id] })
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const getCategoriesByMode = async (mode: string): Promise<Category[]> => {
    return categoryApi.getCategoriesByMode(mode)
  }

  const getCategoryById = async (id: string): Promise<Category | null> => {
    return categoryApi.getCategoryById(id)
  }

  const getCategoryByName = async (name: string): Promise<Category | null> => {
    return categoryApi.getCategoryByName(name)
  }

  return {
    categories,
    isLoading,
    error,
    refetch,
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    getCategoriesByMode,
    getCategoryById,
    getCategoryByName,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  }
}

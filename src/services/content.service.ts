import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Content, Review } from '@/types/content.type'
import { notifications } from '@mantine/notifications'
import { contentApi } from '@/api/content.api'

export const useContent = () => {
  const queryClient = useQueryClient()

  // Fetch all content
  const {
    data: content = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Content[]>({
    queryKey: ['content'],
    queryFn: contentApi.getContent,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: contentApi.createContent,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      return id
    },
  })

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Content> }) =>
      contentApi.updateContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      notifications.show({
        title: 'Success',
        message: 'Content updated successfully',
        color: 'green',
      })
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: `Failed to update content: ${error.message}`,
        color: 'red',
      })
    },
  })

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: contentApi.deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      notifications.show({
        title: 'Success',
        message: 'Content deleted successfully',
        color: 'green',
      })
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: `Failed to delete content: ${error.message}`,
        color: 'red',
      })
    },
  })

  // Get content by type
  const getContentByType = async (
    type: 'comic' | 'video',
  ): Promise<Content[]> => {
    return contentApi.getContentByType(type)
  }

  // Get single content by ID
  const getContentById = (id: string) => {
    return useQuery<Content | null>({
      queryKey: ['content', id],
      queryFn: () => contentApi.getContentById(id),
      enabled: !!id,
    })
  }

  // Upload file
  const uploadFile = async (file: File, path: string): Promise<string> => {
    return contentApi.uploadFile(file, path)
  }

  const getContentReviews = (contentId: string, limitCount: number = 3) => {
    return useQuery<Review[]>({
      queryKey: ['content', contentId, 'reviews', limitCount],
      queryFn: () => contentApi.getReviews(contentId, limitCount),
      enabled: !!contentId,
      staleTime: 60 * 1000, // 1 minute
    })
  }

  return {
    content,
    isLoading,
    error,
    refetch,
    createContent: createContentMutation.mutateAsync,
    updateContent: updateContentMutation.mutateAsync,
    deleteContent: deleteContentMutation.mutate,
    getContentByType,
    getContentById,
    getContentReviews,
    uploadFile,
    isCreating: createContentMutation.isPending,
    isUpdating: updateContentMutation.isPending,
    isDeleting: deleteContentMutation.isPending,
  }
}

// src/services/blog.service.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Blog, CreateBlogDTO, UpdateBlogDTO } from '@/types/blog.type'
import { blogApi } from '@/api/blogs.api'

export const useBlogs = () =>
  useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: blogApi.getBlogs,
  })

export const useBlog = (id: string) =>
  useQuery<Blog | null>({
    queryKey: ['blogs', id],
    queryFn: () => blogApi.getBlogById(id),
    enabled: !!id,
  })

export const useCreateBlog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBlogDTO) => blogApi.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

export const useUpdateBlog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogDTO }) =>
      blogApi.updateBlog(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      queryClient.invalidateQueries({ queryKey: ['blogs', id] })
    },
  })
}

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blogApi.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

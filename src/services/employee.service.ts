import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateEmployee, UpdateEmployee } from '@/types/employee.type'
import { employeeApi } from '@/api/employee.api'

export const useEmployees = () => {
  const queryClient = useQueryClient()

  const listEmployees = useQuery({
    queryKey: ['employees'],
    queryFn: employeeApi.getAll,
  })

  const getEmployeeQuery = (id: string) =>
    useQuery({
      queryKey: ['employees', id],
      queryFn: () => employeeApi.getById(id),
      enabled: !!id,
    })

  const createEmployee = useMutation({
    mutationFn: (data: CreateEmployee) => employeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })

  const updateEmployee = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployee }) =>
      employeeApi.update(id, data),
    onSuccess: (updatedEmployee) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({
        queryKey: ['employees', updatedEmployee.id],
      })
    },
  })

  const deleteEmployee = useMutation({
    mutationFn: (id: string) => employeeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })

  return {
    listEmployees,
    getEmployee: {
      query: getEmployeeQuery,
    },
    createEmployee,
    updateEmployee,
    deleteEmployee,
  }
}

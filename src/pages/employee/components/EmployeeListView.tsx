import { SimpleGrid, Stack } from '@mantine/core'
import type { Employee } from '@/types/employee.type'
import { useState } from 'react'
import ListHeader from '@/components/ListHeader'
import { EmployeeItem } from './EmployeeCard'

interface EmployeeListProps {
  employees: Employee[] | undefined
  onSearch?: (searchTerm: string) => void
  onFilter?: (ids: string[]) => void
  onEdit?: (employee: Employee) => void
  onDelete?: (id: string) => void
  onView?: (employee: Employee) => void
}

export function EmployeeListView({
  employees,
  onSearch,
  onFilter,
  onEdit,
  onDelete,
  onView,
}: EmployeeListProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView)
  }

  return (
    <Stack gap="md">
      <ListHeader
        onViewChange={handleViewChange}
        initialView={view}
        onSearch={onSearch}
        onFilter={onFilter}
      />

      {view === 'grid' ? (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing="md"
          verticalSpacing="md"
        >
          {employees?.map((employee) => (
            <EmployeeItem
              key={employee.id}
              employee={employee}
              variant="card"
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Stack gap="sm">
          {employees?.map((employee) => (
            <EmployeeItem
              key={employee.id}
              employee={employee}
              variant="list"
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}

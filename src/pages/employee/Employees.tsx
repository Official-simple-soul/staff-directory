import { AppButton } from '@/components/AppButton'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { EmployeeListView } from './components/EmployeeListView'
import { useCallback, useState, useMemo } from 'react'
import { CreateAndUpdateEmployeeModal } from '@/components/modals/CreateAndUpdateEmployeeModal'
import { useEmployees } from '@/services/employee.service'
import { EmptyState } from '@/components/EmptyState'
import type { Employee } from '@/types/employee.type'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { notifications } from '@mantine/notifications'
import { colors } from '@/theme/theme'
import { EmployeeProfileModal } from '@/components/modals/EmployeeProfileModal'
import { Drawer } from '@mantine/core'
import LevelBar from './LevelBar'

function Employees() {
  const [
    levelDrawerOpened,
    { open: openLevelDrawer, close: closeLevelDrawer },
  ] = useDisclosure(false)
  const [
    addNewEmployeeModalOpened,
    { open: openAddNewEmployeeModal, close: closeAddNewEmployeeModal },
  ] = useDisclosure(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300)
  const [selectedLevelIds, setSelectedLevelIds] = useState<string[]>([])
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee>()
  const [confirmDelete, setConfirmDelete] = useState<null | string>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>()
  const { listEmployees, deleteEmployee } = useEmployees()

  const employees = listEmployees.data
  const filteredEmployees = useMemo(() => {
    let result = employees

    if (debouncedSearchTerm.trim()) {
      result = result?.filter((employee) =>
        employee.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
    }

    if (selectedLevelIds.length > 0) {
      result = result?.filter(
        (employee) =>
          employee.gradeLevel?.id &&
          selectedLevelIds.includes(employee.gradeLevel.id),
      )
    }

    return result
  }, [employees, debouncedSearchTerm])

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleFilter = useCallback((levelIds: string[]) => {
    setSelectedLevelIds(levelIds)
  }, [])

  const confirmDeleteEmployee = () => {
    if (confirmDelete) {
      deleteEmployee.mutate(confirmDelete, {
        onSuccess() {
          notifications.show({
            title: 'Employee Deleted',
            message: `Employee with id ${confirmDelete} is deleted successfully`,
            color: colors.primary,
          })
          setConfirmDelete(null)
        },
        onError(error) {
          notifications.show({
            title: 'Error deleting employee',
            message: error.message,
            color: colors.danger,
          })
        },
      })
    }
  }

  return (
    <div className="">
      <div className="flex justify-end items-center gap-3 w-full mb-12">
        <AppButton onClick={openAddNewEmployeeModal}>Add Employee</AppButton>
        <AppButton
          variant="outline"
          leftSection={<></>}
          onClick={openLevelDrawer}
        >
          Manage Level
        </AppButton>
      </div>

      {!employees?.length ? (
        <EmptyState
          title="No Employee Added Yet"
          description="Click on the button below to add an employee"
          action={
            <AppButton onClick={openAddNewEmployeeModal}>
              Add Employee
            </AppButton>
          }
        />
      ) : (
        <EmployeeListView
          employees={filteredEmployees}
          onSearch={handleSearchChange}
          onFilter={handleFilter}
          onEdit={(employee) => {
            setEmployeeToEdit(employee)
            openAddNewEmployeeModal()
          }}
          onDelete={setConfirmDelete}
          onView={setSelectedEmployee}
        />
      )}

      <CreateAndUpdateEmployeeModal
        opened={addNewEmployeeModalOpened}
        onClose={closeAddNewEmployeeModal}
        employeeToEdit={employeeToEdit}
      />

      <Drawer
        opened={levelDrawerOpened}
        onClose={closeLevelDrawer}
        title="Level Management"
        position="right"
      >
        <LevelBar />
      </Drawer>

      <EmployeeProfileModal
        employee={selectedEmployee}
        opened={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onEdit={(employee) => {
          setEmployeeToEdit(employee)
          openAddNewEmployeeModal()
        }}
      />

      <ConfirmDeleteModal
        opened={!!confirmDelete}
        title="Are you sure you want to delete this employee?"
        loading={deleteEmployee.isPending}
        onConfirm={confirmDeleteEmployee}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}

export default Employees

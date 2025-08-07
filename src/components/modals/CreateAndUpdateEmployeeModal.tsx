import {
  Modal,
  TextInput,
  Select,
  Textarea,
  Group,
  Box,
  Stack,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useLevels } from '@/services/level.service'
import { useEmployees } from '@/services/employee.service'
import type { CreateEmployee, Employee } from '@/types/employee.type'
import { useCountries } from '@/services/country.service'
import { useEffect } from 'react'
import { colors, radius } from '@/theme/theme'
import { sharedInputProps } from '@/constant/ui'
import { AppButton } from '../AppButton'

interface CreateAndUpdateEmployeeModalProps {
  opened: boolean
  onClose: () => void
  employeeToEdit: Employee | undefined
}

export function CreateAndUpdateEmployeeModal({
  opened,
  onClose,
  employeeToEdit,
}: CreateAndUpdateEmployeeModalProps) {
  const { data: levels = [] } = useLevels().listLevels
  const { createEmployee, updateEmployee } = useEmployees()
  const { countries, getStatesForCountry } = useCountries()

  const form = useForm<CreateEmployee>({
    initialValues: {
      name: '',
      email: '',
      role: '',
      department: '',
      gradeLevelId: '',
      address: '',
      state: '',
      country: '',
      status: 'active',
    },

    validate: {
      name: (value) => (value.trim() ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      role: (value) => (value.trim() ? null : 'Role is required'),
      department: (value) => (value.trim() ? null : 'Department is required'),
      country: (value) => (value.trim() ? null : 'Country is required'),
      state: (value) => (value.trim() ? null : 'State is required'),
    },
  })

  useEffect(() => {
    if (employeeToEdit) {
      form.setValues({
        name: employeeToEdit.name,
        email: employeeToEdit.email,
        role: employeeToEdit.role,
        department: employeeToEdit.department,
        gradeLevelId: employeeToEdit.gradeLevelId || '',
        address: employeeToEdit.address,
        state: employeeToEdit.state,
        country: employeeToEdit.country,
        status: employeeToEdit.status,
      })
    } else {
      form.reset()
    }
  }, [employeeToEdit])

  // Reset state when country changes
  useEffect(() => {
    if (form.values.country) {
      form.setFieldValue('state', '')
    }
  }, [form.values.country])

  const states = form.values.country
    ? getStatesForCountry(form.values.country)
    : []

  const handleSubmit = (values: CreateEmployee) => {
    if (employeeToEdit) {
      updateEmployee.mutate(
        { id: employeeToEdit.id, data: values },
        {
          onSuccess: () => {
            notifications.show({
              title: 'Success',
              message: 'Employee updated successfully',
              color: colors.primary,
            })
            form.reset()
            onClose()
          },
          onError: (error) => {
            notifications.show({
              title: 'Error',
              message: error.message || 'Failed to update employee',
              color: colors.danger,
            })
          },
        },
      )
    } else {
      createEmployee.mutate(values, {
        onSuccess: () => {
          notifications.show({
            title: 'Success',
            message: 'Employee created successfully',
            color: colors.primary,
          })
          form.reset()
          onClose()
        },
        onError: (error) => {
          notifications.show({
            title: 'Error',
            message: error.message || 'Failed to create employee',
            color: colors.danger,
          })
        },
      })
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
      size="lg"
      centered
      radius={radius.app}
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            required
            {...form.getInputProps('name')}
            {...sharedInputProps()}
          />

          <TextInput
            label="Email"
            placeholder="john@company.com"
            required
            {...form.getInputProps('email')}
            {...sharedInputProps()}
          />

          <Group grow>
            <TextInput
              label="Role"
              placeholder="Software Engineer"
              required
              {...form.getInputProps('role')}
              {...sharedInputProps()}
            />

            <Select
              label="Department"
              placeholder="Select department"
              required
              data={['Engineering', 'Product', 'Design', 'Marketing', 'HR']}
              {...form.getInputProps('department')}
              {...sharedInputProps()}
            />
          </Group>

          <Select
            label="Grade Level"
            placeholder="Select grade level"
            data={levels.map((level) => ({
              value: level.id,
              label: level.level_name,
            }))}
            {...form.getInputProps('gradeLevelId')}
            {...sharedInputProps()}
          />

          <Group grow>
            <Select
              label="Country"
              placeholder="Select country"
              required
              data={countries.map((c) => c.country)}
              searchable
              nothingFoundMessage="No countries found"
              {...form.getInputProps('country')}
              {...sharedInputProps()}
            />

            <Select
              label="State/Province"
              placeholder="Select state"
              required
              data={states}
              disabled={!form.values.country}
              searchable
              nothingFoundMessage="No states found for this country"
              {...form.getInputProps('state')}
              {...sharedInputProps()}
            />
          </Group>

          <Textarea
            label="Address"
            placeholder="123 Main St"
            required
            {...form.getInputProps('address')}
            {...sharedInputProps()}
          />

          <Select
            label="Status"
            placeholder="Select employee status"
            data={[
              { label: 'Active', value: 'active' },
              { label: 'Onboarding', value: 'onboarding' },
              { label: 'Inactive', value: 'inactive' },
            ]}
            {...form.getInputProps('status')}
            {...sharedInputProps()}
          />

          <Group justify="flex-end" mt="md">
            <AppButton variant="default" leftSection={<></>} onClick={onClose}>
              Cancel
            </AppButton>
            <AppButton
              type="submit"
              loading={createEmployee.isPending || updateEmployee.isPending}
              disabled={!form.isValid()}
              leftSection={<></>}
            >
              {employeeToEdit ? 'Update Employee' : 'Create Employee'}
            </AppButton>
          </Group>
        </Stack>
      </Box>
    </Modal>
  )
}

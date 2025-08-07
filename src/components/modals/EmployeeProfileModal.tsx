import {
  Avatar,
  Group,
  Stack,
  Text,
  Badge,
  ThemeIcon,
  Box,
  Modal,
  Divider,
} from '@mantine/core'
import {
  IconMapPin,
  IconMail,
  IconBriefcase,
  IconCalendar,
  IconHierarchy,
  IconUser,
  IconEdit,
} from '@tabler/icons-react'
import type { Employee } from '@/types/employee.type'
import { colors } from '@/theme/theme'
import { AppButton } from '../AppButton'

interface EmployeeProfileProps {
  employee: Employee | null | undefined
  opened: boolean
  onClose: () => void
  onEdit?: (employee: Employee) => void
}

export function EmployeeProfileModal({
  employee,
  opened,
  onClose,
  onEdit,
}: EmployeeProfileProps) {
  if (!employee) return null

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="md"
      centered
      title="Employee Profile"
    >
      <Stack gap="sm">
        <Group gap="sm">
          <Avatar src={employee.avatar} size={60} color={colors.primary}>
            {employee.name[0]}
          </Avatar>
          <Box>
            <Text fw={600}>{employee.name}</Text>
            <Text size="sm" c="dimmed">
              {employee.role}
            </Text>
            <Badge
              size="sm"
              color={
                employee.status === 'active'
                  ? 'teal'
                  : employee.status === 'onboarding'
                    ? 'blue'
                    : 'gray'
              }
            >
              {employee.status}
            </Badge>
          </Box>
        </Group>

        <Divider my="xs" />

        <DetailItem
          icon={<IconMail size={16} color={colors.primary} />}
          label="Email"
          value={employee.email}
        />
        <DetailItem
          icon={<IconCalendar size={16} color={colors.primary} />}
          label="Hire Date"
          value={new Date(employee.createdAt).toLocaleDateString()}
        />
        <DetailItem
          icon={<IconUser size={16} color={colors.primary} />}
          label="Employee ID"
          value={employee.id}
        />

        <Divider my="xs" />

        <DetailItem
          icon={<IconBriefcase size={16} color={colors.primary} />}
          label="Department"
          value={employee.department}
        />
        <DetailItem
          icon={<IconHierarchy size={16} color={colors.primary} />}
          label="Grade Level"
          value={employee.gradeLevel?.level_name || 'Not assigned'}
        />

        <Divider my="xs" />

        <DetailItem
          icon={<IconMapPin size={16} color={colors.primary} />}
          label="Address"
          value={
            <Text size="sm">
              {employee.address}, {employee.state}, {employee.country}
            </Text>
          }
        />

        {onEdit && (
          <div className="flex self-end">
            <AppButton
              leftSection={<IconEdit size={14} color={colors.primary} />}
              onClick={() => {
                onClose()
                onEdit(employee)
              }}
              mt="md"
              size="xs"
              variant="outline"
            >
              Edit Profile
            </AppButton>
          </div>
        )}
      </Stack>
    </Modal>
  )
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <Group gap="sm" align="flex-start">
      <ThemeIcon variant="light" bg={colors.layout} size={30} radius="sm">
        {icon}
      </ThemeIcon>
      <Box>
        <Text size="xs" c="dimmed" mb={2}>
          {label}
        </Text>
        <Text size="sm">{value}</Text>
      </Box>
    </Group>
  )
}

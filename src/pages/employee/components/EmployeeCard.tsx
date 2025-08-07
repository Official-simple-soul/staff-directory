import { AppCard } from '@/components/Card'
import { colors } from '@/theme/theme'
import type { Employee } from '@/types/employee.type'
import {
  Avatar,
  Badge,
  Text,
  Group,
  Stack,
  ActionIcon,
  Menu,
  Box,
  Divider,
  Tooltip,
  useMantineTheme,
  Flex,
} from '@mantine/core'
import {
  IconDots,
  IconMail,
  IconMapPin,
  IconBriefcase,
  IconHierarchy,
  IconEdit,
  IconTrash,
  IconUser,
  IconEye,
} from '@tabler/icons-react'

interface EmployeeCardProps {
  employee: Employee
  variant?: 'card' | 'list'
  onView?: (employee: Employee) => void
  onEdit?: (employee: Employee) => void
  onDelete?: (id: string) => void
}

export function EmployeeItem({
  employee,
  variant = 'card',
  onView,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const theme = useMantineTheme()
  const statusColors = {
    active: 'teal',
    onboarding: 'blue',
    inactive: 'gray',
  }

  const ViewMenu = () => {
    return (
      <Menu withinPortal position="bottom-end" shadow="sm" width={120}>
        <Menu.Target>
          <ActionIcon size="sm" variant="subtle" color="gray">
            <IconDots size={16} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEye size={14} />}
            onClick={() => onView?.(employee)}
          >
            View
          </Menu.Item>
          <Menu.Item
            leftSection={<IconEdit size={14} />}
            onClick={() => onEdit?.(employee)}
          >
            Edit
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={14} />}
            onClick={() => onDelete?.(employee.id)}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )
  }

  if (variant === 'list') {
    // List View
    return (
      <AppCard>
        <Group align="center" justify="space-between">
          <Group gap="sm">
            <Avatar src={employee.avatar} size="md" radius="xl">
              {employee.name[0]}
            </Avatar>
            <Box>
              <Text fw={600}>{employee.name}</Text>
              <Text size="sm" c="dimmed">
                {employee.role}
              </Text>
            </Box>
          </Group>

          <Group gap="xs">
            <Badge
              color={statusColors[employee.status]}
              variant="light"
              radius="xl"
              style={{ textTransform: 'capitalize' }}
            >
              {employee.status}
            </Badge>

            <Tooltip label={employee.department} withArrow>
              <Badge
                leftSection={<IconBriefcase size={12} />}
                variant="outline"
                color={colors.primary}
              >
                {employee.department}
              </Badge>
            </Tooltip>

            {employee.gradeLevel && (
              <Tooltip
                label={employee.gradeLevel.level_name || 'No Level'}
                withArrow
              >
                <Badge
                  leftSection={<IconHierarchy size={12} />}
                  variant="filled"
                  color={colors.primary}
                >
                  {employee.gradeLevel.level_name || 'No Level'}
                </Badge>
              </Tooltip>
            )}

            <>{ViewMenu()}</>
          </Group>
        </Group>
      </AppCard>
    )
  }

  //   Card View
  return (
    <AppCard>
      <Group justify="space-between" mb="xs">
        <Badge
          color={statusColors[employee.status]}
          variant="light"
          radius="xl"
          size="xs"
          style={{ textTransform: 'capitalize' }}
        >
          {employee.status}
        </Badge>

        <>{ViewMenu()}</>
      </Group>

      <div className="flex flex-col items-center mb-4">
        <Avatar src={employee.avatar} size="xl" className="rounded-app-radius">
          {employee.name[0]}
        </Avatar>
        <div>
          <Text size="lg" fw={600} ta="center" mt="sm">
            {employee.name}
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {employee.role}
          </Text>
        </div>
      </div>

      <AppCard cardBg={colors.layout}>
        <Stack gap="xs">
          <Group gap="xs">
            <Tooltip label={employee.department} withArrow>
              <Badge
                leftSection={<IconBriefcase size={12} />}
                variant="outline"
                color={colors.primary}
                px={4}
              >
                {employee.department}
              </Badge>
            </Tooltip>

            {employee.gradeLevel ? (
              <Tooltip
                label={employee.gradeLevel.level_name || 'No Level'}
                withArrow
              >
                <Badge
                  leftSection={<IconHierarchy size={12} />}
                  variant="filled"
                  color={colors.primary}
                  px={6}
                >
                  {employee.gradeLevel.level_name || 'No Level'}
                </Badge>
              </Tooltip>
            ) : (
              <Tooltip label="No grade assigned" withArrow>
                <Badge
                  leftSection={<IconHierarchy size={12} />}
                  variant="outline"
                  color="gray"
                  px={4}
                >
                  Unassigned
                </Badge>
              </Tooltip>
            )}
          </Group>

          <Divider my="xs" />

          <Flex gap="xs" align="center">
            <IconMapPin
              size={16}
              color={theme.colors.blue[5]}
              style={{ flexShrink: 0 }}
            />
            <Tooltip
              label={`${employee.address}, ${employee.state}, ${employee.country}`}
            >
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text
                  size="xs"
                  c={colors.info}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                  }}
                >
                  {employee.address}, {employee.state}, {employee.country}
                </Text>
              </Box>
            </Tooltip>
          </Flex>

          <Group gap="xs">
            <IconMail size={16} color={theme.colors.red[5]} />
            <Text
              size="xs"
              component="a"
              href={`mailto:${employee.email}`}
              style={{ textDecoration: 'none' }}
              c={colors.info}
            >
              {employee.email}
            </Text>
          </Group>

          <Group gap="xs">
            <IconUser size={16} color={colors.primary} />
            <Text size="xs" c={colors.info}>
              Added on {new Date(employee?.createdAt).toLocaleDateString()}
            </Text>
          </Group>
        </Stack>
      </AppCard>
    </AppCard>
  )
}

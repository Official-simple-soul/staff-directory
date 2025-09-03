import { colors, radius } from '@/theme/theme'
import { Button, Menu, ActionIcon, Text, type TextProps } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconEye, IconDots, IconTrash, IconPencil } from '@tabler/icons-react'
import type { ReactNode } from 'react'

export const ViewButton = ({
  onClick,
  action_text = 'View',
}: {
  onClick: (row: any) => void
  action_text?: string
}) => {
  const isLg = useMediaQuery('(max-width: 1440px)')
  return (
    <Button
      variant="transparent"
      size={isLg ? 'xs' : 'sm'}
      radius="md"
      leftSection={<IconEye size={16} color="#00D0A6" />}
      fw={400}
      fz={'sm'}
      color="#00D0A6"
      onClick={onClick}
    >
      {action_text}
    </Button>
  )
}

interface TableMenuProps<T> {
  row: T
  onView?: (row: T) => void
  onDelete?: (row: T) => void
  onEdit?: (row: T) => void
  extraItems?: React.ReactNode
  type?: string
}

export function TableMenu<T>({
  row,
  onView,
  onDelete,
  onEdit,
  extraItems,
  type,
}: TableMenuProps<T>) {
  return (
    <Menu shadow="md" width={175} position="bottom-end" radius={radius.app}>
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="dark"
          aria-label="Row actions"
          size={22}
        >
          <IconDots size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {onView && (
          <Menu.Item
            leftSection={<IconEye size={14} />}
            onClick={() => onView(row)}
            py={'xs'}
          >
            <Text size={'sm'}>View {type}</Text>
          </Menu.Item>
        )}

        {onEdit && (
          <Menu.Item
            leftSection={<IconPencil size={14} />}
            onClick={() => onEdit(row)}
            py={'xs'}
          >
            <Text size={'sm'}>Edit {type}</Text>
          </Menu.Item>
        )}

        {onDelete && (
          <Menu.Item
            leftSection={<IconTrash size={14} />}
            color="red"
            onClick={() => onDelete(row)}
            py={'xs'}
          >
            <Text size={'sm'}>Delete {type}</Text>
          </Menu.Item>
        )}

        {extraItems}
      </Menu.Dropdown>
    </Menu>
  )
}

type TableTextProps = TextProps & {
  children: ReactNode
}

export const TableText = ({ children, ...rest }: TableTextProps) => {
  return (
    <Text
      size={'sm'}
      c={colors.text}
      {...rest}
      tt={'capitalize'}
      lineClamp={1}
      fw={400}
    >
      {children}
    </Text>
  )
}

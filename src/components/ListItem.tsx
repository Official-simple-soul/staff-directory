import React from 'react'
import { Avatar, Box, Group, Text } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { colors } from '@/theme/theme'

interface ListItemProps {
  title: string
  subtitle?: string
  avatarLabel?: string
  extraLine?: string
  subtitleColor?: string
  icon?: React.ReactNode
  showArrow?: boolean
  onSelect?: () => void
  rightSection?: React.ReactNode
  rightText?: string
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  avatarLabel,
  extraLine,
  subtitleColor,
  icon,
  rightText,
  showArrow,
  onSelect,
  rightSection,
}) => {
  return (
    <Group
      onClick={onSelect}
      px="sm"
      py="xs"
      className="border border-secondary bg-transparent rounded-app-radius"
    >
      {icon ? (
        <Box className="flex items-center justify-center bg-layout rounded-app-radius h-10 w-10">
          {icon}
        </Box>
      ) : avatarLabel ? (
        <Avatar radius="xl" size={'sm'}>
          {avatarLabel}
        </Avatar>
      ) : null}

      <Box className="flex flex-col flex-grow" style={{ gap: '4px' }}>
        <Text fw={500} size="sm" lh="md" tt={'capitalize'}>
          {title}
        </Text>
        {subtitle && (
          <div className="flex items-center gap-1">
            <Text lh="sm" size="sm" c={subtitleColor || colors.info}>
              {subtitle}
            </Text>
            {extraLine && (
              <div
                className=""
                style={{
                  color: colors.infoLight,
                  background: colors.infoLight,
                  height: 3,
                  width: 3,
                  borderRadius: 3,
                }}
              ></div>
            )}
            {extraLine && (
              <Text size="xs" c={colors.primary}>
                {extraLine}
              </Text>
            )}
          </div>
        )}
      </Box>

      {rightSection ??
        (rightText ? (
          <Text size="md" fw={600}>
            {rightText}
          </Text>
        ) : showArrow ? (
          <IconChevronRight size={16} color="gray" />
        ) : null)}
    </Group>
  )
}

export default ListItem

import { Box, Text, ThemeIcon } from '@mantine/core'
import { IconMoodEmpty } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { colors, radius } from '@/theme/theme'

type EmptyStateProps = {
  icon?: ReactNode
  title?: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  icon = (
    <ThemeIcon variant="light" size={60} radius="xl" color={colors.primary}>
      <IconMoodEmpty size={30} />
    </ThemeIcon>
  ),
  title = 'No data available',
  description = "There's nothing to show here yet",
  action,
}: EmptyStateProps) {
  return (
    <Box
      p={'xl'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '16px',
        width: '100%',
        borderRadius: radius.app,
        backgroundColor: 'transparent',
      }}
    >
      <Box style={{ opacity: 0.8, lineHeight: 1 }}>{icon}</Box>

      <Box>
        <Text size={'md'} fw={600} c={colors.text}>
          {title}
        </Text>
        <Text
          size={'xs'}
          c={colors.info}
          style={{ maxWidth: '400px', lineHeight: 1.4 }}
        >
          {description}
        </Text>
      </Box>

      {action && (
        <Box
          style={{
            marginTop: '24px',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  )
}

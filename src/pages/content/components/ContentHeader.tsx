import { colors } from '@/theme/theme'
import { Group, Text, ThemeIcon } from '@mantine/core'
import { IconBook, IconVideo } from '@tabler/icons-react'

export function ContentHeader({ type }: { type: 'reading' | 'watching' }) {
  const Icon = type === 'reading' ? IconBook : IconVideo

  return (
    <Group gap="sm">
      <ThemeIcon color={colors.primary} size="lg" radius="md">
        <Icon size={18} />
      </ThemeIcon>
      <Text fw={600} size="lg">
        Add new {type === 'reading' ? 'Reading' : 'Watching'} content
      </Text>
    </Group>
  )
}

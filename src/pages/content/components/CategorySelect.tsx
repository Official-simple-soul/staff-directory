import { sharedInputProps } from '@/constant/ui'
import { colors } from '@/theme/theme'
import type { Category } from '@/types/category.type'
import {
  Box,
  Button,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'

interface CategorySelectProps {
  categories: Category[]
  mode: 'reading' | 'watching'
  value: string
  onChange: (category: Category) => void
  onCreate: (payload: { name: string; icon: string }) => Promise<void>
}

export function CategorySelect({
  categories,
  mode,
  value,
  onChange,
  onCreate,
}: CategorySelectProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')

  const filtered = categories.filter((c) => c.mode === mode)

  return (
    <Stack gap="xs">
      <Select
        label="Category"
        placeholder="Select a category"
        searchable
        required
        value={value}
        data={filtered.map((c) => ({
          value: c.id,
          label: c.name,
        }))}
        onChange={(id) => {
          const selected = filtered.find((c) => c.id === id)
          if (selected) onChange(selected)
        }}
        {...sharedInputProps()}
      />

      {!isCreating && (
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconPlus size={14} />}
          color={colors.primary}
          onClick={() => setIsCreating(true)}
        >
          Create new category
        </Button>
      )}

      {isCreating && (
        <Box p="sm" className="rounded-lg border border-dashed">
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              New Category ({mode})
            </Text>

            <TextInput
              label="Category name"
              placeholder="e.g. Fantasy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              {...sharedInputProps()}
            />

            <TextInput
              label="Icon (text)"
              placeholder="e.g. ✨ or 📚"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              {...sharedInputProps()}
            />

            <Group justify="flex-end">
              <Button
                variant="default"
                size="xs"
                onClick={() => {
                  setIsCreating(false)
                  setName('')
                  setIcon('')
                }}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                color={colors.primary}
                disabled={!name.trim()}
                onClick={async () => {
                  await onCreate({ name, icon })
                  setIsCreating(false)
                  setName('')
                  setIcon('')
                }}
              >
                Add category
              </Button>
            </Group>
          </Stack>
        </Box>
      )}
    </Stack>
  )
}

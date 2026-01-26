import { modalBaseProps, sharedInputProps } from '@/constant/ui'
import { useCollection } from '@/services/collection.service'
import { colors } from '@/theme/theme'
import type { Collection } from '@/types/collection.type'
import {
  Box,
  Group,
  Modal,
  MultiSelect,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useEffect } from 'react'
import { AppButton } from '../AppButton'

interface CreateCollectionModalProps {
  opened: boolean
  onClose: () => void
  collectionToEdit?: Collection
}

const genres = [
  'action',
  'adventure',
  'comedy',
  'drama',
  'fantasy',
  'horror',
  'mystery',
  'romance',
  'sci-fi',
  'superhero',
  'thriller',
  'super-hero',
]

const contentTypes = [
  { value: 'reading', label: 'Flex' },
  { value: 'watching', label: 'Watching' },
]

export function CreateCollectionModal({
  opened,
  onClose,
  collectionToEdit,
}: CreateCollectionModalProps) {
  const { createCollection, isCreating } = useCollection()
  const form = useForm({
    initialValues: {
      name: '',
      author: '',
      mode: 'reading' as 'reading' | 'watching',
      genre: [] as string[],
    },

    validate: {
      name: (value) => (value.trim() ? null : 'Collection name is required'),
      author: (value) => (value.trim() ? null : 'Author is required'),
      mode: (value) => (value ? null : 'Content type is required'),
      genre: (value) =>
        value.length > 0 ? null : 'At least one genre is required',
    },
  })

  useEffect(() => {
    if (collectionToEdit) {
      form.setValues({
        name: collectionToEdit.name,
        author: collectionToEdit.author,
        mode: collectionToEdit.mode,
        genre: collectionToEdit.genre,
      })
    } else {
      form.reset()
    }
  }, [collectionToEdit, opened])

  const handleSubmit = (values: typeof form.values) => {
    console.log('Submitting collection:', values)

    createCollection(values, {
      onSuccess: () => {
        notifications.show({
          title: 'Success',
          message: `Collection ${
            collectionToEdit ? 'updated' : 'created'
          } successfully`,
          color: colors.primary,
        })
        form.reset()
        onClose()
      },
      onError: (error: Error) => {
        notifications.show({
          title: 'Error',
          message: `Failed to ${
            collectionToEdit ? 'update' : 'create'
          } collection: ${error.message}`,
          color: colors.danger,
        })
      },
    })
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={collectionToEdit ? 'Edit Collection' : 'Create New Collection'}
      centered
      {...modalBaseProps()}
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Collection Name"
            placeholder="Enter collection name"
            required
            {...form.getInputProps('name')}
            {...sharedInputProps()}
          />

          <TextInput
            label="Author"
            placeholder="Enter author name"
            required
            {...form.getInputProps('author')}
            {...sharedInputProps()}
          />

          <Select
            label="Content Type"
            placeholder="Select type"
            required
            data={contentTypes}
            {...form.getInputProps('mode')}
            {...sharedInputProps()}
          />

          <MultiSelect
            label="Genres"
            placeholder="Select genres"
            required
            data={genres}
            searchable
            {...form.getInputProps('genre')}
            {...sharedInputProps()}
          />

          <Group justify="flex-end" mt="md">
            <AppButton
              variant="default"
              onClick={onClose}
              loading={isCreating}
              disabled={isCreating}
            >
              Cancel
            </AppButton>
            <AppButton type="submit" loading={isCreating} disabled={isCreating}>
              {collectionToEdit ? 'Update Collection' : 'Create Collection'}
            </AppButton>
          </Group>
        </Stack>
      </Box>
    </Modal>
  )
}

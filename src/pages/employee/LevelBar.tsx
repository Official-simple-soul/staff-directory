import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import ListItem from '@/components/ListItem'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { RightActionButtons } from '@/components/RightActionButtons'
import { sharedInputProps } from '@/constant/ui'
import { useLevels } from '@/services/level.service'
import { colors } from '@/theme/theme'
import type { CreateGradeLevel, UpdateGradeLevel } from '@/types/level.type'
import { Box, Stack, Text, TextInput, Loader } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconAward } from '@tabler/icons-react'
import { useState } from 'react'

function LevelBar() {
  const { listLevels, createLevel, updateLevel, deleteLevel } = useLevels()
  const levels = listLevels.data

  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<null | string>(null)

  const form = useForm({
    initialValues: {
      level_name: '',
      level_abbreviation: '',
    },

    validate: {
      level_name: (value) =>
        value.trim().length < 2
          ? 'level name must be at least 2 characters'
          : null,
      level_abbreviation: (value) =>
        value.trim().length < 1 ? 'Abbreviation is required' : null,
    },
  })

  const handleEdit = (level: {
    id: string
    level_name: string
    level_abbreviation: string
  }) => {
    setEditingId(level.id)
    form.setValues({
      level_name: level.level_name,
      level_abbreviation: level.level_abbreviation,
    })
  }

  const saveLevel = (values: UpdateGradeLevel) => {
    if (editingId) {
      updateLevel.mutate(
        { id: editingId, data: values },
        {
          onSuccess() {
            notifications.show({
              title: 'level Created',
              message: `level with id ${editingId} is updated successfully`,
              color: colors.primary,
            })
            setEditingId(null)
          },
          onError(error) {
            notifications.show({
              title: 'Error updating level',
              message: error.message,
              color: colors.danger,
            })
          },
        },
      )
    } else {
      createLevel.mutate(values as CreateGradeLevel, {
        onSuccess() {
          notifications.show({
            title: 'level Created',
            message: `${values.level_name} is created successfully`,
            color: colors.primary,
          })
        },
        onError(error) {
          notifications.show({
            title: 'Error creating level',
            message: error.message,
            color: colors.danger,
          })
        },
      })
    }
    form.reset()
  }

  const handleDelete = (id: string) => {
    setConfirmDelete(id)
  }

  const confirmDeleteLevel = () => {
    if (confirmDelete) {
      deleteLevel.mutate(confirmDelete, {
        onSuccess() {
          notifications.show({
            title: 'level deleted',
            message: `level with id ${confirmDelete} is deleted successfully`,
            color: colors.primary,
          })
          setConfirmDelete(null)
        },
        onError(error) {
          notifications.show({
            title: 'Error deleting level',
            message: error.message,
            color: colors.danger,
          })
        },
      })
    }
  }

  return (
    <div>
      <Box mt={'xl'}>
        <Box className="space-y-2">
          {listLevels.isLoading ? (
            <Loader type="bars" size={'xs'} />
          ) : !levels?.length ? (
            <EmptyState
              title="No level yet"
              description={'You can add a new level with the form below'}
            />
          ) : (
            levels.map((e) => (
              <ListItem
                key={e.id}
                title={e.level_name}
                subtitle={e.level_abbreviation}
                subtitleColor={colors.info}
                icon={<IconAward size={24} color={colors.primary} />}
                rightSection={
                  <RightActionButtons
                    onEdit={() => handleEdit(e)}
                    onDelete={() => handleDelete(e.id)}
                  />
                }
              />
            ))
          )}
        </Box>

        <Stack mt={'xl'}>
          <Text size={'md'} fw={700}>
            {editingId ? 'Update level' : 'Add New level'}
          </Text>

          <form onSubmit={form.onSubmit(saveLevel)} className="space-y-2">
            <TextInput
              label="Level Name"
              placeholder="Enter level name"
              required
              {...sharedInputProps()}
              {...form.getInputProps('level_name')}
            />
            <TextInput
              label="Level Abbreviation"
              placeholder="Enter level abbreviation"
              required
              {...sharedInputProps()}
              {...form.getInputProps('level_abbreviation')}
            />
            <div className="mt-3">
              <AppButton
                type="submit"
                leftSection={<></>}
                fullWidth
                disabled={!form.isValid()}
                loading={createLevel.isPending || updateLevel.isPending}
              >
                {editingId ? 'Update' : 'Add level'}
              </AppButton>
              {editingId && (
                <AppButton
                  variant="subtle"
                  color={colors.danger}
                  fullWidth
                  leftSection={<></>}
                  size={'compact-xs'}
                  onClick={() => {
                    setEditingId(null)
                    form.reset()
                  }}
                  mt={'sm'}
                >
                  Cancel Edit
                </AppButton>
              )}
            </div>
          </form>
        </Stack>
      </Box>

      <ConfirmDeleteModal
        opened={!!confirmDelete}
        title="Are you sure you want to delete this level?"
        loading={deleteLevel.isPending}
        onConfirm={confirmDeleteLevel}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}

export default LevelBar

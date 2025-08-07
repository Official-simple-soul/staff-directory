import { Modal, Button, Stack } from '@mantine/core'
import { modalBaseProps } from '@/constant/ui'
import { ModalTitle } from '@/components/ModalTitle'

interface ConfirmDeleteModalProps {
  opened: boolean
  loading?: boolean
  title?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDeleteModal({
  opened,
  loading = false,
  title = 'Are you sure you want to delete this item?',
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Modal opened={opened} onClose={onCancel} {...modalBaseProps()}>
      <ModalTitle title={title} />
      <Stack mt="md" gap="xs">
        <Button
          color="red"
          onClick={onConfirm}
          loading={loading}
          loaderProps={{ type: 'bars', size: 'xs' }}
          size="xs"
          style={{ fontSize: '14px' }}
        >
          Yes, Delete
        </Button>
        <Button
          variant="light"
          size="xs"
          onClick={onCancel}
          style={{ fontSize: '14px' }}
        >
          Cancel
        </Button>
      </Stack>
    </Modal>
  )
}

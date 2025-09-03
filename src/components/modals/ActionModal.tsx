import React from 'react'
import { Modal, Box, Text, Group, Center, Stack } from '@mantine/core'
import { modalBaseProps } from '@/constant/ui'
import { colors } from '@/theme/theme'
import { AppButton } from '../AppButton'

interface ActionModalProps {
  opened: boolean
  onClose: () => void
  title: React.ReactNode
  icon?: React.ReactNode
  iconColor?: string
  iconMainColor?: string
  isImage?: boolean
  message: React.ReactNode
  currencySymbol?: string
  primaryButtonText: string
  onPrimaryButtonClick: () => void
  primaryButtonColor?: string
  isPrimaryButtonLoading?: boolean
  secondaryButtonText?: string
  onSecondaryButtonClick?: () => void
  secondaryButtonColor?: string
  isDelete?: boolean
}

const ActionModal: React.FC<ActionModalProps> = ({
  opened,
  onClose,
  title,
  icon,
  message,
  primaryButtonText,
  onPrimaryButtonClick,
  primaryButtonColor = colors.primary,
  isPrimaryButtonLoading = false,
  secondaryButtonText,
  onSecondaryButtonClick,
  secondaryButtonColor = 'gray',
  isDelete = false,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} centered {...modalBaseProps()}>
      <Stack align="center">
        {icon && <Center>{icon}</Center>}

        <Box
          className="flex flex-col"
          style={{
            gap: '10px',
          }}
        >
          <Text
            size="24px"
            c={isDelete ? 'dark' : colors.primary}
            fw={500}
            ta="center"
          >
            {title}
          </Text>

          <Text size="16px" c={colors.infoLight} fw={500} ta="center">
            {message}
          </Text>
        </Box>

        <Group grow style={{ width: '100%' }} mt="sm">
          {secondaryButtonText && onSecondaryButtonClick && (
            <AppButton
              variant="light"
              color={secondaryButtonColor}
              onClick={onSecondaryButtonClick}
              leftSection={<></>}
              bg={colors.infoLight}
              c={colors.primary}
            >
              {secondaryButtonText}
            </AppButton>
          )}
          <AppButton
            color={primaryButtonColor}
            onClick={onPrimaryButtonClick}
            loading={isPrimaryButtonLoading}
            leftSection={<></>}
          >
            {primaryButtonText}
          </AppButton>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ActionModal

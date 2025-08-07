import React from 'react'
import { Button, rem, type ButtonProps } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { colors, radius } from '@/theme/theme'

interface AppButtonProps extends ButtonProps {
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset' | undefined
}

export const AppButton: React.FC<AppButtonProps> = ({
  style,
  leftSection,
  color,
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <Button
      radius={radius.app}
      leftSection={leftSection ?? <IconPlus size={16} />}
      color={color ?? colors.primary}
      loaderProps={{ type: 'bars' }}
      size={'sm'}
      type={type}
      onClick={onClick}
      style={{
        fontSize: rem(10),
      }}
      {...props}
    />
  )
}

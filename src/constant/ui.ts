import { colors, radius } from '@/theme/theme'
import type { CSSProperties } from 'react'

export const sharedInputProps = () => ({
  radius: radius.app,
  size: 'sm',
  styles: {
    label: { color: colors.text },
    option: {
      textTransform: 'capitalize' as CSSProperties['textTransform'],
    },
    input: {
      borderColor: colors.infoLight,
    },
  },
})

export const modalBaseProps = () => ({
  radius: radius.app,
  padding: 'md',
  size: 'sm',
  overlayProps: {
    backgroundOpacity: 0.55,
    blur: 1,
  },
  closeButtonProps: {
    size: 20,
  },
  withCloseButton: false,
})

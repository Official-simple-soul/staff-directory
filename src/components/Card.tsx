import { type ReactNode } from 'react'
import { Paper } from '@mantine/core'
import { colors, radius } from '@/theme/theme'

export const AppCard = ({
  children,
  cardBg = 'white',
  onClick,
  className = '',
}: {
  children: ReactNode
  cardBg?: string
  height?: number
  onClick?: () => void
  className?: string
}) => {
  return (
    <Paper
      className={className}
      p={'sm'}
      radius={radius.app}
      withBorder
      style={{
        borderRadius: radius.app,
        backgroundColor: cardBg,
        height: 'auto',
        overflow: 'auto',
        borderColor: colors.infoLight,
      }}
      onClick={onClick}
    >
      {children}
    </Paper>
  )
}

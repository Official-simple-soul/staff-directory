import { IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

interface BackProps {
  size?: number
  color?: string
  to?: string
}

export const Back: React.FC<BackProps> = ({
  size = 20,
  color = 'gray',
  to = '..',
}) => {
  const navigate = useNavigate()

  return (
    <IconArrowLeft
      className="cursor-pointer"
      size={size}
      color={color}
      onClick={() => navigate({ to })}
    />
  )
}

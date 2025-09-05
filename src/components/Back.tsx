import { IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { AppButton } from './AppButton'

interface BackProps {
  to?: string
  page: string
}

export const Back: React.FC<BackProps> = ({ to = '..', page }) => {
  const navigate = useNavigate()

  return (
    <AppButton
      variant="default"
      leftSection={<IconArrowLeft size={18} />}
      onClick={() => navigate({ to })}
    >
      Back to {page}
    </AppButton>
  )
}

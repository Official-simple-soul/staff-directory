import { colors, radius } from '@/theme/theme'
import { IconPencil, IconTrash } from '@tabler/icons-react'

type TableActionButtonsProps = {
  onEdit: () => void
  onDelete: () => void
  size?: number
  radius?: string
}

export const RightActionButtons = ({
  onEdit,
  onDelete,
  size = 18,
}: TableActionButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="p-2 cursor-pointer"
        style={{
          borderRadius: radius.app,
          backgroundColor: colors.layout,
        }}
        onClick={onEdit}
      >
        <IconPencil size={size} color={colors.secondary} />
      </div>
      <div
        className="p-2 cursor-pointer"
        style={{
          borderRadius: radius.app,
          backgroundColor: '#FEEDED',
        }}
        onClick={onDelete}
      >
        <IconTrash size={size} color={colors.danger} />
      </div>
    </div>
  )
}

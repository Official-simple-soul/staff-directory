import { Text } from '@mantine/core'

export const ModalTitle = ({ title }: { title: string }) => {
  return (
    <Text fw={700} size={'md'} ta={'center'} mb={'lg'} tt={'capitalize'}>
      {title}
    </Text>
  )
}

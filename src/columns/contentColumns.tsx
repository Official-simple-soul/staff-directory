import type { ColumnDefinition } from '@/types/global.types'
import type { Content } from '@/types/content.type'
import { Badge, Box, Group, Image } from '@mantine/core'
import { IconBook, IconVideo, IconCrown, IconClock } from '@tabler/icons-react'
import { TableMenu, TableText } from './Reuseable'
import { colors } from '@/theme/theme'

export const contentColumns = (
  handleView: (content: Content) => void,
  handleEdit: (row: Content) => void,
  confirmDeleteProduct: any,
): ColumnDefinition<Content>[] => {
  return [
    {
      accessor: 'cover',
      header: 'Content',
      width: 300,
      render: (row: Content) => (
        <Group wrap="nowrap">
          <Image
            src={row.img}
            w={40}
            h={50}
            radius="sm"
            alt={row.title}
            fallbackSrc="https://placehold.co/40x50?text=Cover"
            className="flex-shrink-0"
          />
          <Box style={{ minWidth: 0 }}>
            <TableText className="truncate">{row.title}</TableText>
          </Box>
        </Group>
      ),
    },
    {
      accessor: 'collection',
      header: 'Collection',
      render: (row: Content) => (
        <Badge
          variant="light"
          leftSection={
            row.type === 'comic' ? (
              <IconBook size={14} />
            ) : (
              <IconVideo size={14} />
            )
          }
          color={colors.primary}
          size={'md'}
          styles={{
            root: {
              textTransform: 'capitalize',
              fontWeight: 500,
            },
          }}
        >
          {row.collection}
        </Badge>
      ),
    },
    {
      accessor: 'package',
      header: 'Package',
      render: (row: Content) => {
        return (
          <Badge
            variant="light"
            leftSection={
              row.package === 'premium' ? <IconCrown size={14} /> : null
            }
            size={'md'}
            styles={{
              root: {
                fontWeight: 500,
                textTransform: 'capitalize',
                backgroundColor: colors.layout,
                color: colors.primary,
              },
            }}
          >
            {row.package}
          </Badge>
        )
      },
    },
    {
      accessor: 'stats',
      header: 'Reads',
      render: (row: Content) => (
        <TableText>{row.totalReads?.toLocaleString() || 0}</TableText>
      ),
    },
    {
      accessor: 'stats',
      header: 'Completions',
      render: (row: Content) => (
        <TableText c={colors.info}>
          {row.totalCompletions?.toLocaleString() || 0}
        </TableText>
      ),
    },
    {
      accessor: 'stats',
      header: 'Unique Users',
      render: (row: Content) => (
        <TableText c={colors.info}>{row.viewIds?.length || 0}</TableText>
      ),
    },
    {
      accessor: 'status',
      header: 'Status',
      render: (row: Content) => {
        const status =
          row?.schedule && row.schedule?.toDate() > new Date()
            ? 'scheduled'
            : row.status

        return (
          <Badge
            variant="light"
            leftSection={
              status === 'scheduled' ? <IconClock size={14} /> : null
            }
            size={'md'}
            styles={{
              root: {
                fontWeight: 500,
                textTransform: 'capitalize',
                backgroundColor: colors.layout,
                color: colors.primary,
              },
            }}
          >
            {status}
            {status === 'scheduled' && (
              <Box component="span" ml={4}>
                {row.schedule?.toDate().toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
              </Box>
            )}
          </Badge>
        )
      },
    },
    {
      accessor: 'action',
      header: 'Action',
      align: 'center',
      render: (row: Content) => (
        <TableMenu
          type="content"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={confirmDeleteProduct}
          row={row}
        />
      ),
    },
  ]
}

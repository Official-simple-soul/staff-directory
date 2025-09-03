import React, { useState } from 'react'
import {
  Table,
  Group,
  Text,
  TextInput,
  Box,
  Loader,
  Badge,
  Pagination,
  Menu,
  Checkbox,
  Divider,
  Select,
} from '@mantine/core'
import { IconChevronDown, IconFilter2, IconSearch } from '@tabler/icons-react'
import { colors, radius } from '@/theme/theme'
import { sharedInputProps } from '@/constant/ui'
import { DatePicker } from '@mantine/dates'
import type { ReusableTableProps, TableRowData } from '@/types/global.types'
import { appLimit } from '@/constant/constant'
import { AppButton } from './AppButton'

const filterOptions: { label: string; value: string }[][] = [
  [
    { label: 'Today', value: '1d' },
    { label: 'Last 2 Months', value: '2m' },
  ],
  [
    { label: 'This Week', value: '1w' },
    { label: 'Last 3 Months', value: '3m' },
  ],
  [
    { label: 'This Month', value: '1m' },
    { label: 'Last 6 Months', value: '6m' },
  ],
]

function TableComp<T extends TableRowData>({
  data,
  columns,
  totalRecords,
  onPageChange,
  currentPage,
  isLoading,
  tableTitle,
  onSearch,
  onFilter,
  showSearch = true,
  showFilter = true,
  filterComponent,
  showPagination = true,
  pagination = {
    limit: 5,
    nextKey: undefined,
  },
  noDataMessage = 'No data found.',
  headerActions,
  searchPlaceholder = 'Search...',
  onPerPageChange,
}: ReusableTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFilterMenu, setOpenFilterMenu] = useState(false)
  const [filterSelection, setFilterSelection] = useState('')
  const [perPage, setPerPage] = useState(appLimit)
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ])

  const hasMorePages = !!pagination?.nextKey
  const totalPages = hasMorePages ? currentPage + 1 : currentPage
  const colSpan = columns.length

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const tableRows = data?.map((row, index) => (
    <Table.Tr
      key={row.id || index}
      bg={index % 2 === 1 ? 'white' : 'transparent'}
    >
      {columns.map((column, colIndex) => (
        <Table.Td
          key={String(column.accessor) + colIndex}
          style={{
            textAlign: column.align || 'left',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {column.render ? (
            column.render(row)
          ) : (
            <Text
              size="md"
              c="dimmed"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {String(row[column.accessor as keyof T] ?? '')}
            </Text>
          )}
        </Table.Td>
      ))}
    </Table.Tr>
  ))

  return (
    <Box bg="transparent" style={{ borderRadius: radius.app }}>
      <Group justify="space-between" align="center" mb={'sm'}>
        <Group align="center">
          <Text size="md" fw={600} className="text-gray-800">
            {tableTitle}
          </Text>
          <Badge
            variant="filled"
            color={colors.secondary}
            radius="lg"
            className="px-2 py-1"
            p={'sm'}
            fz={'xs'}
          >
            {isLoading ? '...' : (totalRecords ?? 0)}
          </Badge>
        </Group>
        <Group gap={'xs'}>
          {showSearch && (
            <TextInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              leftSection={<IconSearch size={16} color={colors.infoLight} />}
              {...sharedInputProps()}
            />
          )}
          {showFilter &&
            (filterComponent ? (
              filterComponent
            ) : (
              <Menu
                width={200}
                position="bottom-end"
                closeOnItemClick={false}
                opened={openFilterMenu}
                onChange={setOpenFilterMenu}
              >
                <Menu.Target>
                  <AppButton
                    variant="default"
                    fw={'normal'}
                    color="gray"
                    fz={'sm'}
                    style={{
                      borderColor: '#EEEEEE',
                    }}
                    leftSection={<IconFilter2 size={16} />}
                    rightSection={<IconChevronDown size={16} />}
                  >
                    Filter
                  </AppButton>
                </Menu.Target>
                <Menu.Dropdown
                  w={200}
                  p={'md'}
                  style={{ borderRadius: radius.app }}
                >
                  <div className="flex justify-between items-center">
                    <Text size={'md'}>By Date</Text>
                    <Text
                      size={'sm'}
                      c={'red'}
                      onClick={() => {
                        setFilterSelection('')
                        onFilter?.('1m')
                        setOpenFilterMenu(false)
                      }}
                      className="cursor-pointer"
                    >
                      Reset
                    </Text>
                  </div>
                  <div className="space-y-2.5 mt-6">
                    {filterOptions.map((row, i) => (
                      <div key={i} className="grid grid-cols-2">
                        {row.map((option) => {
                          const isActive = filterSelection === option.value
                          return (
                            <Checkbox
                              key={option.value}
                              checked={isActive}
                              onChange={() => setFilterSelection(option.value)}
                              label={option.label}
                              radius="sm"
                              color={colors.primary}
                              size={'xs'}
                              styles={{
                                label: {
                                  color: isActive
                                    ? colors.info
                                    : colors.infoLight,
                                  fontSize: '12px',
                                },
                              }}
                            />
                          )
                        })}
                      </div>
                    ))}

                    <Divider />
                    <Checkbox
                      checked={filterSelection === 'date-range'}
                      onChange={(_) => setFilterSelection('date-range')}
                      label="Date Range"
                      radius={'sm'}
                      size={'xs'}
                      color={colors.primary}
                      styles={{
                        label: {
                          color:
                            filterSelection === 'date-range'
                              ? colors.info
                              : colors.infoLight,
                          fontSize: '12px',
                        },
                      }}
                    />
                    {filterSelection === 'date-range' && (
                      <DatePicker
                        type="range"
                        value={dateRange}
                        onChange={setDateRange}
                        styles={{
                          monthTbody: {
                            background: '#f4f5fa',
                            borderRadius: radius.app,
                          },
                        }}
                        size={'sm'}
                      />
                    )}
                    <AppButton
                      fullWidth
                      leftSection={<></>}
                      mt={'sm'}
                      onClick={() => {
                        onFilter?.(
                          filterSelection === 'date-range'
                            ? dateRange.join(',')
                            : filterSelection,
                        )
                        setOpenFilterMenu(false)
                      }}
                    >
                      Filter
                    </AppButton>
                  </div>
                </Menu.Dropdown>
              </Menu>
            ))}
          {headerActions}
        </Group>
      </Group>

      <Table.ScrollContainer minWidth={800}>
        <Table
          verticalSpacing={'sm'}
          horizontalSpacing="md"
          className="border-collapse"
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr bg={'white'}>
              {columns.map((column, index) => (
                <Table.Th
                  key={String(column.accessor) + index}
                  style={{
                    width: column.width,
                    textAlign: column.align || 'left',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#212121',
                  }}
                  className="capitalize px-4 py-3"
                >
                  {column.header}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={colSpan}>
                  <Group justify="center" p="xl">
                    <Loader size={'xs'} type={'bars'} />
                    <Text size={'sm'} c="dimmed">
                      Loading {tableTitle.toLowerCase()} data...
                    </Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ) : data && data.length > 0 ? (
              tableRows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={colSpan}>
                  <Text ta="center" c="dimmed" p="md">
                    {noDataMessage}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {showPagination && (
        <Group justify="space-between" mt="md">
          <Group gap={'md'}>
            <Select
              data={['20', '50', '100']}
              size={'xs'}
              value={String(perPage)}
              onChange={(value) => {
                if (value) {
                  setPerPage(Number(value))
                  onPerPageChange?.(value)
                }
              }}
              w={70}
            />
            <Text size={'sm'}>Per page</Text>
          </Group>
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={onPageChange}
            boundaries={1}
            siblings={1}
            color={colors.primary}
            size={'xs'}
            radius={radius.app}
            styles={{
              control: {
                '&[dataActive]': {
                  backgroundColor: 'var(--mantine-color-blue-6)',
                },
                '&[dataDirection="next"]': {
                  opacity: !hasMorePages && currentPage > 0 ? 0.5 : 1,
                  cursor:
                    !hasMorePages && currentPage > 0
                      ? 'not-allowed'
                      : 'pointer',
                },
                '&[dataDirection="prev"]': {
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                },
              },
            }}
          />
        </Group>
      )}
    </Box>
  )
}

export default TableComp

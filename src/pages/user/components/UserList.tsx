import { useState } from 'react'
import { Group, Text, Menu, Select, Stack } from '@mantine/core'
import { IconFilter2, IconChevronDown, IconX } from '@tabler/icons-react'
import type { User } from '@/types/user.type'
import TableComp from '@/components/Table'
import { userColumns } from '@/columns/userColumn'
import { AppButton } from '@/components/AppButton'
import { colors, radius } from '@/theme/theme'
import { sharedInputProps } from '@/constant/ui'

interface UserListProps {
  users: User[]
  isLoading?: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onView: (user: User) => void
}

interface SearchParams {
  currentPage: number
  limit: number
  role: string
  package: string
  search: string
}

export const UserList: React.FC<UserListProps> = ({
  users,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
}) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    currentPage: 1,
    limit: 10000,
    role: '',
    package: '',
    search: '',
  })
  const [filterOpened, setFilterOpened] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const {
    currentPage,
    limit,
    role: roleFilter,
    package: packageFilter,
    search,
  } = searchParams

  const roles = Array.from(
    new Set(users.map((user) => user.role).filter(Boolean)),
  )
  const packages = Array.from(
    new Set(users.map((user) => user.packageSub).filter(Boolean)),
  )

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, currentPage: page }))
  }

  const handlePerPageChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      limit: parseInt(value),
      currentPage: 1,
    }))
  }

  const handleSearch = (query: string) => {
    setSearchParams((prev) => ({ ...prev, search: query, currentPage: 1 }))
  }

  const handleApplyFilter = () => {
    setSearchParams((prev) => ({
      ...prev,
      role: selectedRole || '',
      package: selectedPackage || '',
      currentPage: 1,
    }))
    setFilterOpened(false)
  }

  const handleClearFilter = () => {
    setSelectedRole(null)
    setSelectedPackage(null)
    setSearchParams((prev) => ({
      ...prev,
      role: '',
      package: '',
      currentPage: 1,
    }))
    setFilterOpened(false)
  }

  const filteredUsers = users.filter((user) => {
    if (roleFilter && user.role !== roleFilter) return false
    if (packageFilter && user.packageSub !== packageFilter) return false

    if (search) {
      const searchQuery = search.toLowerCase()
      const matchesName = user.name?.toLowerCase().includes(searchQuery)
      const matchesEmail = user.email.toLowerCase().includes(searchQuery)
      const matchesDisplayName = user.displayName
        ?.toLowerCase()
        .includes(searchQuery)

      if (!matchesName && !matchesEmail && !matchesDisplayName) {
        return false
      }
    }

    return true
  })

  const totalRecords = filteredUsers.length
  const totalPages = Math.ceil(totalRecords / limit)
  const hasMorePages = currentPage < totalPages

  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit
  const currentPageData = filteredUsers.slice(startIndex, endIndex)

  return (
    <TableComp
      data={currentPageData}
      columns={userColumns(onView, onEdit, onDelete)}
      totalRecords={totalRecords}
      recordsPerPage={limit}
      onPageChange={handlePageChange}
      currentPage={currentPage}
      isLoading={isLoading}
      tableTitle="User Management"
      onSearch={handleSearch}
      showPagination={true}
      hasMorePages={hasMorePages}
      showFilter={true}
      onPerPageChange={handlePerPageChange}
      filterComponent={
        <Menu
          width={300}
          position="bottom-end"
          closeOnItemClick={false}
          opened={filterOpened}
        >
          <Menu.Target>
            <AppButton
              variant="default"
              fw={'normal'}
              onClick={() => setFilterOpened((o) => !o)}
              color="gray"
              style={{
                fontSize: '14px',
                color: 'gray',
                borderColor: '#EEEEEE',
              }}
              leftSection={<IconFilter2 size={16} />}
              rightSection={<IconChevronDown size={14} />}
            >
              Filter
            </AppButton>
          </Menu.Target>
          <Menu.Dropdown w={320} p={'md'} style={{ borderRadius: radius.app }}>
            <Stack gap="xs">
              <Text size={'md'} fw={500}>
                Filter Users
              </Text>

              <Select
                label="Role"
                placeholder="Select role"
                data={roles.map((role) => ({ value: role, label: role }))}
                value={selectedRole}
                onChange={setSelectedRole}
                searchable
                clearable
                nothingFoundMessage="No roles found"
                {...sharedInputProps()}
              />

              <Select
                label="Subscription Package"
                placeholder="Select package"
                data={packages.map((pkg) => ({ value: pkg, label: pkg }))}
                value={selectedPackage}
                onChange={setSelectedPackage}
                searchable
                clearable
                nothingFoundMessage="No packages found"
                {...sharedInputProps()}
              />

              <Group grow mt="md">
                <AppButton
                  variant="default"
                  onClick={handleClearFilter}
                  disabled={!roleFilter && !packageFilter}
                  leftSection={<IconX size={16} color={colors.danger} />}
                >
                  Clear
                </AppButton>
                <AppButton onClick={handleApplyFilter}>Apply Filter</AppButton>
              </Group>
            </Stack>
          </Menu.Dropdown>
        </Menu>
      }
    />
  )
}

export default UserList

import { sharedInputProps } from '@/constant/ui'
import {
  Checkbox,
  Group,
  Menu,
  SegmentedControl,
  Text,
  TextInput,
} from '@mantine/core'
import {
  IconChevronDown,
  IconLayoutGrid,
  IconList,
  IconSearch,
} from '@tabler/icons-react'
import { AppButton } from './AppButton'
import { colors, radius } from '@/theme/theme'
import { useState } from 'react'
import { useLevels } from '@/services/level.service'

interface ListHeaderProps {
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (searchTerm: string) => void
  showFilter?: boolean
  filterComponent?: React.ReactNode
  onFilter?: (filterValues: string[]) => void
  onViewChange?: (view: 'grid' | 'list') => void
  initialView?: 'grid' | 'list'
}

function ListHeader({
  showSearch = true,
  searchPlaceholder = 'Search by name',
  onSearch,
  showFilter = true,
  filterComponent,
  onFilter,
  onViewChange,
  initialView = 'grid',
}: ListHeaderProps) {
  if (!showSearch && !showFilter) return null

  const { listLevels } = useLevels()
  const levels = listLevels.data
  const [openFilterMenu, setOpenFilterMenu] = useState(false)
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState<'grid' | 'list'>(initialView)

  const handleViewChange = (value: string) => {
    const newView = value as 'grid' | 'list'
    setView(newView)
    onViewChange?.(newView)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleLevelToggle = (levelId: string) => {
    setSelectedLevels((prev) =>
      prev.includes(levelId)
        ? prev.filter((id) => id !== levelId)
        : [...prev, levelId],
    )
  }

  const applyFilters = () => {
    onFilter?.(selectedLevels)
    setOpenFilterMenu(false)
  }

  const resetFilters = () => {
    setSelectedLevels([])
    onFilter?.([])
    setOpenFilterMenu(false)
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0 w-full">
      <Group gap={'xs'} className="flex-1 flex flex-col md:flex-row w-full">
        {showSearch && (
          <TextInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            leftSection={<IconSearch size={16} />}
            {...sharedInputProps()}
            className="w-full md:w-[240px]"
          />
        )}

        {showFilter &&
          (filterComponent ? (
            filterComponent
          ) : (
            <Menu
              position="bottom-end"
              closeOnItemClick={false}
              opened={openFilterMenu}
              onChange={setOpenFilterMenu}
            >
              <Menu.Target>
                <AppButton
                  variant="default"
                  fw={'normal'}
                  leftSection={<></>}
                  rightSection={
                    <IconChevronDown size={14} color={colors.info} />
                  }
                  styles={{
                    root: {
                      borderColor: colors.infoLight,
                    },
                    label: {
                      color: colors.info,
                    },
                  }}
                  className="w-full md:w-auto"
                >
                  Filter{' '}
                  {selectedLevels.length > 0 && `(${selectedLevels.length})`}
                </AppButton>
              </Menu.Target>
              <Menu.Dropdown
                w={240}
                p={'md'}
                style={{ borderRadius: radius.app }}
              >
                <div className="flex justify-between items-center">
                  <Text size="xs">By Level</Text>
                  <Text
                    size="xs"
                    c={'red'}
                    onClick={resetFilters}
                    className="cursor-pointer"
                  >
                    Reset
                  </Text>
                </div>
                <div className="space-y-2 mt-4">
                  {levels?.map((level) => (
                    <Checkbox
                      key={level.id}
                      checked={selectedLevels.includes(level.id)}
                      onChange={() => handleLevelToggle(level.id)}
                      label={level.level_name}
                      radius="sm"
                      color={colors.primary}
                      size="xs"
                      styles={{
                        label: {
                          color: selectedLevels.includes(level.id)
                            ? colors.secondary
                            : colors.info,
                          fontSize: '12px',
                        },
                      }}
                    />
                  ))}
                </div>

                <AppButton
                  fullWidth
                  leftSection={<></>}
                  mt={'md'}
                  onClick={applyFilters}
                  size="xs"
                >
                  Apply Filters
                </AppButton>
              </Menu.Dropdown>
            </Menu>
          ))}
      </Group>

      <div className="ml-0 md:ml-auto">
        <SegmentedControl
          size="lg"
          value={view}
          onChange={handleViewChange}
          data={[
            { label: <IconLayoutGrid size={16} />, value: 'grid' },
            { label: <IconList size={16} />, value: 'list' },
          ]}
        />
      </div>
    </div>
  )
}

export default ListHeader

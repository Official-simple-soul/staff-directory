import { type ReactNode } from 'react'
import {
  AppShell,
  Burger,
  Group,
  Text,
  Avatar,
  Box,
  ScrollArea,
} from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { Link } from '@tanstack/react-router'
import AppLogo from '@/components/AppLogo'
import { links } from './data/sidebar_data'
import { colors } from '@/theme/theme'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [desktopOpened] = useDisclosure(true)
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 90,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="lg"
    >
      <AppShell.Header
        p="lg"
        bg={colors.layout}
        className="flex items-center justify-between"
      >
        <Group>
          {isMobile && (
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
          )}
          <AppLogo />
        </Group>

        <Group gap="md" className="cursor-pointer">
          <Avatar
            alt={'profile'}
            radius="xl"
            color={colors.primary}
            size="sm"
            style={{ textTransform: 'uppercase' }}
          >
            AD
          </Avatar>
          <Box
            style={{
              gap: '8px',
            }}
            className="flex flex-col"
          >
            <Text size="md">Admin</Text>
          </Box>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar bg={colors.layout} pt={'xl'}>
        <AppShell.Section grow component={ScrollArea} scrollbarSize={0}>
          {links.map((link, index) => (
            <Link
              to={link.route}
              key={index}
              activeProps={{
                className:
                  'text-primary font-bold cursor-pointer border-l-2 border-l-primary ',
                style: { fontWeight: 500 },
              }}
              className="flex flex-col items-center text-info justify-center gap-1 py-2 mb-3 transition-all ease-in-out font-normal cursor-pointer"
            >
              {link.icon}
              <p className="text-[10px]">{link.label}</p>
            </Link>
          ))}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main bg={colors.background}>{children}</AppShell.Main>
    </AppShell>
  )
}

export default DashboardLayout

import { IconContainer, IconDashboard, IconUsers } from '@tabler/icons-react'

export const links = [
  {
    icon: <IconDashboard size={20} />,
    label: 'Dashboard',
    route: '/dashboard',
  },
  {
    icon: <IconContainer size={20} />,
    label: 'Content',
    route: '/content',
  },
  // {
  //   icon: <IconUsers size={20} />,
  //   label: 'Employees',
  //   route: '/employee',
  // },
  {
    icon: <IconUsers size={20} />,
    label: 'Users',
    route: '/users',
  },
]

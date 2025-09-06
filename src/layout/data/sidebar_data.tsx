import { roles } from '@/config/config'
import {
  IconContainer,
  IconDashboard,
  IconPaperBag,
  IconUsers,
} from '@tabler/icons-react'

export const links = [
  {
    icon: <IconDashboard size={20} />,
    label: 'Dashboard',
    route: '/dashboard',
    allowedRoles: roles.dashboard,
  },
  {
    icon: <IconContainer size={20} />,
    label: 'Content Management',
    route: '/content',
    allowedRoles: roles.content,
  },
  {
    icon: <IconUsers size={20} />,
    label: 'Employees',
    route: '/employee',
    allowedRoles: roles.employee,
  },
  {
    icon: <IconUsers size={20} />,
    label: 'Users Management',
    route: '/users',
    allowedRoles: roles.users,
  },
  {
    icon: <IconPaperBag size={20} />,
    label: 'Blogs Management',
    route: '/blogs',
    allowedRoles: roles.blogs,
  },
]

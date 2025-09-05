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
    label: 'Content',
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
    label: 'Users',
    route: '/users',
    allowedRoles: roles.users,
  },
  {
    icon: <IconPaperBag size={20} />,
    label: 'Blogs',
    route: '/blogs',
    allowedRoles: roles.blogs,
  },
]

import type { GradeLevel } from './level.type'

export interface Employee {
  id: string
  name: string
  email: string
  role: string
  department: string
  gradeLevelId?: string
  gradeLevel?: GradeLevel
  address: string
  state: string
  country: string
  status: 'active' | 'onboarding' | 'inactive'
  avatar?: string
  createdAt: Date
  updatedAt?: Date
}

export type CreateEmployee = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateEmployee = Partial<CreateEmployee>

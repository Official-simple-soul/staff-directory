import type {
  Employee,
  CreateEmployee,
  UpdateEmployee,
} from '@/types/employee.type'
import { levelApi } from './level.api'

// Normally I will keep this in .env for security purpose
const EMPLOYEES_KEY = 'employees'

const getEmployeesFromStorage = (): Employee[] => {
  const data = localStorage.getItem(EMPLOYEES_KEY)
  return data ? JSON.parse(data) : []
}

const saveEmployeesToStorage = (employees: Employee[]) => {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees))
}

const attachGradeLevels = async (
  employees: Employee[],
): Promise<Employee[]> => {
  const levels = await levelApi.getAll()
  return employees.map((employee) => ({
    ...employee,
    gradeLevel: levels.find((level) => level.id === employee.gradeLevelId),
  }))
}

export const employeeApi = {
  async getAll(): Promise<Employee[]> {
    const employees = getEmployeesFromStorage()
    return attachGradeLevels(employees)
  },

  async getById(id: string): Promise<Employee | undefined> {
    const employees = getEmployeesFromStorage()
    const employee = employees.find((emp) => emp.id === id)
    if (!employee) return undefined

    const levels = await levelApi.getAll()
    return {
      ...employee,
      gradeLevel: levels.find((level) => level.id === employee.gradeLevelId),
    }
  },

  async create(data: CreateEmployee): Promise<Employee> {
    const employees = getEmployeesFromStorage()
    const newEmployee = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: data.status || 'active',
    }
    employees.push(newEmployee)
    saveEmployeesToStorage(employees)
    return this.getById(newEmployee.id) as Promise<Employee>
  },

  async update(id: string, data: UpdateEmployee): Promise<Employee> {
    const employees = getEmployeesFromStorage()
    const index = employees.findIndex((emp) => emp.id === id)
    if (index === -1) throw new Error('Employee not found')

    const updatedEmployee = {
      ...employees[index],
      ...data,
      updatedAt: new Date(),
    }

    employees[index] = updatedEmployee
    saveEmployeesToStorage(employees)
    return this.getById(id) as Promise<Employee>
  },

  async delete(id: string): Promise<void> {
    const employees = getEmployeesFromStorage()
    const filteredEmployees = employees.filter((emp) => emp.id !== id)
    saveEmployeesToStorage(filteredEmployees)
  },
}

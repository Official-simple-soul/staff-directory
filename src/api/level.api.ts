import type {
  GradeLevel,
  CreateGradeLevel,
  UpdateGradeLevel,
} from '@/types/level.type'

// Normally I will keep this in .env for security purpose
const LEVELS_KEY = 'grade-levels'

const getLevelsFromStorage = (): GradeLevel[] => {
  const data = localStorage.getItem(LEVELS_KEY)
  return data ? JSON.parse(data) : []
}

const saveLevelsToStorage = (levels: GradeLevel[]) => {
  localStorage.setItem(LEVELS_KEY, JSON.stringify(levels))
}

export const levelApi = {
  async getAll(): Promise<GradeLevel[]> {
    return getLevelsFromStorage()
  },

  async getById(id: string): Promise<GradeLevel | undefined> {
    const levels = getLevelsFromStorage()
    return levels.find((level) => level.id === id)
  },

  async create(data: CreateGradeLevel): Promise<GradeLevel> {
    const levels = getLevelsFromStorage()
    const newLevel = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    levels.push(newLevel)
    saveLevelsToStorage(levels)
    return newLevel
  },

  async update(id: string, data: UpdateGradeLevel): Promise<GradeLevel> {
    const levels = getLevelsFromStorage()
    const index = levels.findIndex((level) => level.id === id)
    if (index === -1) throw new Error('Level not found')

    const updatedLevel = {
      ...levels[index],
      ...data,
      updatedAt: new Date(),
    }

    levels[index] = updatedLevel
    saveLevelsToStorage(levels)
    return updatedLevel
  },

  async delete(id: string): Promise<void> {
    const levels = getLevelsFromStorage()
    const filteredLevels = levels.filter((level) => level.id !== id)
    saveLevelsToStorage(filteredLevels)
  },
}

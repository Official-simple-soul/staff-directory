export interface GradeLevel {
  id: string
  level_name: string
  level_abbreviation: string
  createdAt?: Date
  updatedAt?: Date
}

export type CreateGradeLevel = Omit<
  GradeLevel,
  'id' | 'createdAt' | 'updatedAt'
>
export type UpdateGradeLevel = Partial<CreateGradeLevel>

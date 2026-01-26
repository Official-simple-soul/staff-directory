import { Timestamp } from 'firebase/firestore'

export interface Category {
  id: string
  name: string
  icon: string
  mode: 'watching' | 'reading'
  createdAt: Timestamp
}

export interface CreateCategoryDTO {
  name: string
  icon: string
  mode: string
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

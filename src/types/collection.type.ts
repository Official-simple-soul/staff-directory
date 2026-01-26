import { Timestamp } from 'firebase/firestore'

export interface Collection {
  id?: string
  name: string
  author: string
  genre: string[]
  count?: number
  mode: 'reading' | 'watching'
  createdAt?: Timestamp
}

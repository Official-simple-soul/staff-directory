import { Timestamp } from 'firebase/firestore'

export interface Collection {
  id?: string
  name: string
  author: string
  type: 'comic' | 'video'
  genre: string[]
  count?: number
  createdAt?: Timestamp
}

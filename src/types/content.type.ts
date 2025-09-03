import { Timestamp } from 'firebase/firestore'

export interface Content {
  id?: string
  author: string
  collection: string
  collectionId: string
  collectionNum: number
  genre: string[]
  img: string
  key?: string
  num?: number
  package: 'free' | 'premium'
  pages: number
  pdf?: string
  video?: string
  preview: string
  rating: number
  reviews: number
  schedule: Timestamp | null
  status: 'draft' | 'published'
  tag: string
  title: string
  totalCompletions: number
  totalReads: number
  totalViews: number
  type: 'comic' | 'video'
  uploaded?: Timestamp
  view: number
  viewIds: string[]
}

export interface CreateContentDTO
  extends Omit<
    Content,
    | 'id'
    | 'totalCompletions'
    | 'totalReads'
    | 'totalViews'
    | 'view'
    | 'viewIds'
    | 'rating'
    | 'reviews'
  > {
  // These will be set to default values on creation
  totalCompletions?: number
  totalReads?: number
  totalViews?: number
  view?: number
  viewIds?: string[]
  rating?: number
  reviews?: number
}

export interface Review {
  id: string
  image: string
  rating: number
  reviewText: string
  reviewer: string
}

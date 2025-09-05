import { Timestamp } from 'firebase/firestore'

export interface Blog {
  id: string
  allowInteraction: boolean
  isApproved: boolean
  author: {
    id: string
    name: string
    username: string
    avatar: string
  }
  author_id: string
  comment: number
  content: string
  cover: string
  created_at: Timestamp
  updated_at: Timestamp
  like: number
  likedBy: string[]
  share: number
}

export interface CreateBlogDTO
  extends Omit<
    Blog,
    'id' | 'created_at' | 'updated_at' | 'comment' | 'like' | 'share'
  > {}

export interface UpdateBlogDTO
  extends Partial<Omit<Blog, 'id' | 'created_at' | 'updated_at'>> {}

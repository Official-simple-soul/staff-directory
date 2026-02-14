import { Timestamp } from 'firebase/firestore'
import type { UserSubscription } from './subscription.type'

export type UserRole = 'admin' | 'user' | 'moderator'
export type UserStatus = 'active' | 'inactive'
export interface User {
  id: string
  auth_url: string
  coin: number
  coins: number
  country: string
  customer_code: string
  displayName: string
  email: string
  gender: string
  lastLogin: Timestamp
  lastRewardedDate: Timestamp
  name: string
  packageSub: string
  phone: string
  photoURL: string
  push_token: string
  referral_code: string
  role: UserRole
  streak: UserStreak
  streaks: number
  subscription: UserSubscription
  createdAt?: Timestamp
  updatedAt?: Timestamp
  isActive?: boolean
  lastSeen?: Timestamp
}

export interface CreateUserDTO
  extends Omit<
    User,
    'id' | 'lastLogin' | 'lastRewardedDate' | 'createdAt' | 'updatedAt'
  > {
  password?: string
}

export interface UpdateUserDTO extends Partial<Omit<User, 'id'>> {}

export interface UserStreak {
  currentDay: number
  lastClaimDate?: string
}

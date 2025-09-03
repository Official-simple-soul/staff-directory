import { Timestamp } from 'firebase/firestore'

export interface AnalyticsData {
  completion: number
  content: number
  reads: number
  tool: string
  users: number
  views: number
  timestamp: Timestamp
}

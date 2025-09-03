import {
  type QueryDocumentSnapshot,
  type DocumentData,
  type SnapshotOptions,
  doc,
  getDoc,
  updateDoc,
  increment,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Analytics interface for the data we expect to receive
export interface AnalyticsSnapshot {
  completion: number
  content: number
  reads: number
  tool: string
  users: number
  views: number
  timestamp: any
}

const analyticsConverter = {
  toFirestore(analytics: AnalyticsSnapshot): DocumentData {
    return {
      completion: analytics.completion,
      content: analytics.content,
      reads: analytics.reads,
      tool: analytics.tool,
      users: analytics.users,
      views: analytics.views,
      timestamp: analytics.timestamp,
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): AnalyticsSnapshot {
    const data = snapshot.data(options)
    return {
      completion: data.completion,
      content: data.content,
      reads: data.reads,
      tool: data.tool,
      users: data.users,
      views: data.views,
      timestamp: data.timestamp,
    }
  },
}

export const analyticsApi = {
  async getLatestAnalytics(): Promise<AnalyticsSnapshot | null> {
    const docRef = doc(db, 'analytics', 'analytics').withConverter(
      analyticsConverter,
    )

    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  },

  async incrementCount(
    field: keyof Pick<
      AnalyticsSnapshot,
      'completion' | 'content' | 'reads' | 'users' | 'views'
    >,
    amount = 1,
  ): Promise<void> {
    const docRef = doc(db, 'analytics', 'analytics')
    await updateDoc(docRef, {
      [field]: increment(amount),
    })
  },

  async decrementCount(
    field: keyof Pick<
      AnalyticsSnapshot,
      'completion' | 'content' | 'reads' | 'users' | 'views'
    >,
    amount = 1,
  ): Promise<void> {
    const docRef = doc(db, 'analytics', 'analytics')
    await updateDoc(docRef, {
      [field]: increment(-amount),
    })
  },
}

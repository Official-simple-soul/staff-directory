import { Timestamp } from 'firebase/firestore'

const isFirestoreTimestamp = (val: any): val is Timestamp =>
  !!val && typeof val.toDate === 'function'

export const getScheduledTimestamp = (
  isScheduled: boolean,
  scheduledDate?: unknown,
) => {
  if (!isScheduled || !scheduledDate) return undefined

  return isFirestoreTimestamp(scheduledDate)
    ? scheduledDate
    : Timestamp.fromDate(new Date(scheduledDate as any))
}

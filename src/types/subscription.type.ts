export type SubscriptionTier = 'free' | 'bronze' | 'silver' | 'gold'
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'expired'
  | 'past_due'
  | 'trialing'

export interface UserSubscription {
  status: SubscriptionStatus
  plan: string
  planId: string
  period?: 'monthly' | 'biannual' | 'annual'
  customerCode?: string
  nextPaymentDate?: string | null
  subscriptionMethod?: 'card' | 'coin'
  startedAt?: string
}

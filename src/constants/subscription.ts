export const SUBSCRIPTION_TIER_SCORES = {
  free: 0,
  basic: 50,
  standard: 100,
  premium: 200,
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIER_SCORES;

export function getSubscriptionScore(tier: SubscriptionTier) {
  return SUBSCRIPTION_TIER_SCORES[tier];
}

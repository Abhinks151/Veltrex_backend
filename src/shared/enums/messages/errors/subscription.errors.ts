export const SUBSCRIPTION_ERRORS = {
  SUBSCRIPTION_NOT_FOUND: 'Subscription not found',
  SUBSCRIPTION_EXPIRED: 'Subscription has expired. Please upgrade to continue.',
  SUBSCRIPTION_RESTRICTED: 'Subscription is restricted. Access denied.',
  NO_SUBSCRIPTION_FOUND: 'No active subscription found for this tenant',
  ACTIVE_PAID_SUBSCRIPTION_EXISTS:
    'Organization already has an active paid subscription',
  FREE_PLAN_ONLY: 'This endpoint is only for free plans',
  ACTIVE_SUBSCRIPTION_EXISTS:
    'Organization already has an active paid subscription',
  FREE_PLAN_ACTIVATION_BLOCKED:
    'Cannot activate free plan: an active paid subscription already exists',
  TRIAL_ALREADY_USED: 'Free trial has already been used by this organization',
  PLAN_NOT_FOUND: 'Plan not found',
} as const;

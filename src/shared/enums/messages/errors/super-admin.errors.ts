export const SUPER_ADMIN_ERRORS = {
  DASHBOARD_STATS_FETCH_FAILED: 'Failed to retrieve dashboard statistics',
  TOTAL_TENANTS_COUNT_FAILED: 'Failed to retrieve total tenants count',
  TENANTS_CREATED_RANGE_FAILED: 'Failed to retrieve tenants created in range',
  RECENT_TENANTS_FAILED: 'Failed to retrieve recent tenants',
  TENANTS_INTERVAL_FAILED: 'Failed to retrieve tenants created by interval',
  TOTAL_USERS_COUNT_FAILED: 'Failed to retrieve total users count',
  TOTAL_REVENUE_FAILED: 'Failed to retrieve total revenue',
  CUSTOM_RANGE_REQUIRED:
    'Start date and end date are required for custom range',
  INVALID_CUSTOM_RANGE: 'End date cannot be before start date',
  INVALID_DATE_FORMAT: 'Invalid date format',
  UNSUPPORTED_DATE_RANGE: 'Unsupported date range filter',
  REVENUE_IN_RANGE_FAILED: 'Failed to fetch revenue in range',
  REVENUE_PAYMENTS_IN_RANGE_FAILED: 'Failed to retrieve payments in range',
  REVENUE_RECENT_SUBSCRIPTIONS_FAILED:
    'Failed to retrieve recent subscriptions',
  REVENUE_ACTIVE_SUBSCRIPTIONS_FAILED:
    'Failed to retrieve active subscriptions count',
  MACHINIST_DASHBOARD_FETCH_FAILED:
    'Failed to retrieve machinist dashboard statistics',
} as const;

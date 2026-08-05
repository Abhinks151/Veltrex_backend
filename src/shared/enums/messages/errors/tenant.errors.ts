export const TENANT_ERRORS = {
  TENANT_NOT_FOUND: 'Tenant not found',
  ACCESS_DENIED_SUBDOMAIN:
    'Access denied: You do not have permission to access this subdomain.',
  TENANT_NAME_TAKEN: 'Tenant name already taken',
  FAILED_TO_UPDATE_TENANT: 'Failed to update tenant',
  FAILED_TO_CREATE_TENANT: 'Failed to create tenant',
  TENANT_IS_BLOCKED: 'Tenant is blocked',
  TENANT_ID_MISSING: 'Tenant identification missing',
  FAILED_TO_CHECK_TENANT: 'Failed to check tenant',
  USER_NOT_AUTHORIZED_CREATE_TENANT: 'User is not authorized to create tenant',
} as const;

export const SHIFT_ERRORS = {
  EMPLOYEE_NOT_FOUND: 'Employee not found or blocked',
  EMPLOYEE_BLOCKED: 'Employee is currently blocked',
  EMPLOYEE_IS_BLOCKED: 'Employee is blocked',
  SHIFT_TEMPLATE_ALREADY_EXISTS:
    'Employee already has an active shift template in this date range',
  AT_LEAST_ONE_JOB_MUST_BE_ASSIGNED: 'At least one job must be assigned',
  ASSIGNED_QUANTITY_MUST_BE_GREATER_THAN_0:
    'Assigned quantity must be greater than 0',
  FAILED_TO_CREATE_SHIFT_TEMPLATE: 'Failed to create shift template',
  SHIFT_TEMPLATE_NOT_FOUND: 'Shift template not found',
  FAILED_TO_CREATE_SHIFT: 'Failed to create shift',
  FAILED_TO_DELETE_SHIFT_TEMPLATE: 'Failed to delete shift template',
  FAILED_TO_UPDATE_SHIFT_TEMPLATE: 'Failed to update shift template',
  SHIFT_JOB_NOT_FOUND: 'Shift job not found',
  COMPLETED_QUANTITY_CANNOT_BE_NEGATIVE:
    'Completed quantity cannot be negative',
  CANNOT_UPDATE_PROGRESS_FOR_PAST_SHIFTS:
    'Cannot update progress for past shifts',
  SHIFT_NOT_FOUND: 'Shift not found',
  CRON_JOB_FAILED: 'Cron job failed',
  FAILED_TO_GENERATE_PRODUCTION_SHIFT: 'Failed to generate production shift',
  PRODUCTION_SHIFT_ALREADY_GENERATED_FOR_THIS_TEMPLATE_AND_DATE:
    'Production shift already generated for this template and date',
  SHIFT_TEMPLATE_HAS_NO_ASSIGNED_JOBS: 'Shift template has no assigned jobs',
} as const;

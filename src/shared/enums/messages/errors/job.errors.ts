export const JOB_ERRORS = {
  JOB_NOT_FOUND: 'Job not found',
  FAILED_TO_CREATE_JOB: 'Failed to create job',
  FAILED_TO_UPDATE_JOB: 'Failed to update job',
  INVALID_ASSIGNEE: 'Invalid assignee for this job',
  JOB_IS_COMPLETED_OR_CANCELLED: 'Job is completed or cancelled',
  CANNOT_UPDATE_QUANTITY_WHEN_JOB_IS_IN_PROGRESS_OR_COMPLETED:
    'Cannot update quantity when job is in progress or completed',
} as const;

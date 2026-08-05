export const PART_ERRORS = {
  PART_NOT_FOUND: 'Part not found',
  PART_NUMBER_TAKEN: 'Part number already exists, try another one',
  FAILED_TO_CREATE_PART: 'Failed to create part',
  FAILED_TO_UPDATE_PART: 'Failed to update part',
  PART_IN_USE:
    'Cannot delete part: it is currently associated with active jobs',
} as const;

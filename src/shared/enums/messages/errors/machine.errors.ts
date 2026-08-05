export const MACHINE_ERRORS = {
  MACHINE_NOT_FOUND: 'Machine not found',
  MACHINE_NAME_TAKEN: 'Machine name already exists, try another one',
  FAILED_TO_CREATE_MACHINE: 'Failed to create machine',
  FAILED_TO_UPDATE_MACHINE: 'Failed to update machine',
  MACHINE_ALREADY_DELETED: 'Machine is already deleted',
  MACHINE_IN_USE:
    'Cannot delete machine: it is currently associated with active parts',
} as const;

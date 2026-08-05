export const FIXTURE_ERRORS = {
  FIXTURE_NOT_FOUND: 'Fixture not found',
  FIXTURE_NAME_TAKEN: 'Fixture name already exists, try another one',
  FAILED_TO_CREATE_FIXTURE: 'Failed to create fixture',
  FAILED_TO_UPDATE_FIXTURE: 'Failed to update fixture',
  FIXTURE_ALREADY_DELETED: 'Fixture is already deleted',
  FIXTURE_IN_USE:
    'Cannot delete fixture: it is currently associated with active parts',
} as const;

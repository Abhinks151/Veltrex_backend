export const NC_PROGRAM_ERRORS = {
  NC_PROGRAM_NOT_FOUND: 'NC Program not found',
  NC_PROGRAM_NAME_TAKEN: 'NC Program name already exists, try another one',
  NC_PROGRAM_NAME_CHARACTERS_ONLY: 'Name must contain only letters and spaces',
  NC_PROGRAM_DESCRIPTION_CHARACTERS_ONLY:
    'Description must contain only letters and spaces',
  FAILED_TO_CREATE_NC_PROGRAM: 'Failed to create NC Program',
  FAILED_TO_UPDATE_NC_PROGRAM: 'Failed to update NC Program',
  INVALID_NC_FILE_TYPE:
    'Invalid NC file type. Allowed: .nc, .cnc, .tap, .ngc, .txt, .mpf, .ptp',
  VERSION_NOT_FOUND: 'Program version not found',
  CANNOT_DELETE_LAST_VERSION:
    'Cannot delete the final remaining valid version of a program',
  NC_PROGRAM_CONTENT_REQUIRED: 'Program content cannot be empty',
  NC_VERSION_CONTENT_REQUIRED: 'Version content cannot be empty',
  NC_VERSION_CONTENT_FETCH_FAILED: 'Failed to fetch version content',
  NC_PROGRAM_ALREADY_DELETED: 'NC Program is already deleted',
  NC_PROGRAM_IN_USE:
    'Cannot delete NC Program because it is currently assigned to one or more parts',
  PROGRAM_NOT_FOUND: 'Program not found',
} as const;

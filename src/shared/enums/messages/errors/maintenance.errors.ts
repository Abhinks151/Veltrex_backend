export const MAINTENANCE_ERRORS = {
  MACHINE_NOT_IN_ASSIGNED_JOBS:
    'Cannot choose this machine. It must only come from the jobs assigned to you.',
  MACHINE_ALREADY_HAS_ACTIVE_TICKET:
    'This machine already has an active maintenance ticket.',
  TICKET_NOT_FOUND: 'Maintenance ticket not found.',
  TICKET_ALREADY_TAKEN: 'This ticket was already taken by another technician.',
  TICKET_NOT_ASSIGNED_TO_YOU: 'This ticket is not assigned to you.',
  TICKET_CANNOT_BE_RELEASED: 'Only IN_PROGRESS tickets can be released.',
  TICKET_CANNOT_BE_CLOSED:
    'Only IN_PROGRESS tickets assigned to you can be closed.',
  NO_MACHINES_AVAILABLE:
    'You have no machines available from your assigned jobs.',
  FAILED_TO_CREATE_TICKET: 'Failed to create maintenance ticket.',
  FAILED_TO_ASSIGN_TICKET: 'Failed to assign maintenance ticket.',
  FAILED_TO_RELEASE_TICKET: 'Failed to release maintenance ticket.',
  FAILED_TO_CLOSE_TICKET: 'Failed to close maintenance ticket.',
  MAINTENANCE_CANNOT_DELETE_MACHINE:
    'Cannot delete machine: it currently has an active maintenance ticket.',
} as const;

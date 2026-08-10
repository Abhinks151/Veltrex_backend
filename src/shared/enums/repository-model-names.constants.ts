export const REPOSITORY_MODEL_NAMES = {
  USER: 'user',
  PLAN: 'plan',
  TENANT: 'tenant',
  FIXTURE: 'fixture',
  MACHINE: 'machine',
  PAYMENT: 'payment',
  SUBSCRIPTION: 'subscription',
  RAW_MATERIAL: 'rawMaterial',
  JOB: 'job',
  PART: 'part',
  LOOKUP: 'lookup',
  SHIFT_TEMPLATE: 'shiftTemplate',
  SHIFT_TEMPLATE_JOB: 'shiftTemplateJob',
  SHIFT_JOB: 'shiftJob',
  PRODUCTION_SHIFT: 'productionShift',
  NC_PROGRAM: 'ncProgram',
  PROGRAM_VERSION: 'programVersion',
  MAINTENANCE_TICKET: 'maintenanceTicket',
  NOTIFICATION: 'notification',
} as const;

export type RepositoryModelName =
  (typeof REPOSITORY_MODEL_NAMES)[keyof typeof REPOSITORY_MODEL_NAMES];

export const RepositoryModelNames = REPOSITORY_MODEL_NAMES;

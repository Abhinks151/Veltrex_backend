import { AUTH_ERRORS } from './auth.errors';
import { TENANT_ERRORS } from './tenant.errors';
import { SUBSCRIPTION_ERRORS } from './subscription.errors';
import { PAYMENT_ERRORS } from './payment.errors';
import { MACHINE_ERRORS } from './machine.errors';
import { FIXTURE_ERRORS } from './fixture.errors';
import { RAW_MATERIAL_ERRORS } from './raw-material.errors';
import { PART_ERRORS } from './part.errors';
import { JOB_ERRORS } from './job.errors';
import { NC_PROGRAM_ERRORS } from './nc-program.errors';
import { SHIFT_ERRORS } from './shift.errors';
import { SUPER_ADMIN_ERRORS } from './super-admin.errors';
import { PROFILE_ERRORS } from './profile.errors';
import { SHARED_ERRORS } from './shared.errors';
import { STORAGE_ERRORS } from './storage.error';
import { MAINTENANCE_ERRORS } from './maintenance.errors';
import { NOTIFICATION_ERRORS } from './notification.errors';

export const ERROR_MESSAGES = {
  ...AUTH_ERRORS,
  ...TENANT_ERRORS,
  ...SUBSCRIPTION_ERRORS,
  ...PAYMENT_ERRORS,
  ...MACHINE_ERRORS,
  ...FIXTURE_ERRORS,
  ...RAW_MATERIAL_ERRORS,
  ...PART_ERRORS,
  ...JOB_ERRORS,
  ...NC_PROGRAM_ERRORS,
  ...SHIFT_ERRORS,
  ...SUPER_ADMIN_ERRORS,
  ...PROFILE_ERRORS,
  ...SHARED_ERRORS,
  ...STORAGE_ERRORS,
  ...MAINTENANCE_ERRORS,
  ...NOTIFICATION_ERRORS,
} as const;

export {
  AUTH_ERRORS,
  TENANT_ERRORS,
  SUBSCRIPTION_ERRORS,
  PAYMENT_ERRORS,
  MACHINE_ERRORS,
  FIXTURE_ERRORS,
  RAW_MATERIAL_ERRORS,
  PART_ERRORS,
  JOB_ERRORS,
  NC_PROGRAM_ERRORS,
  SHIFT_ERRORS,
  SUPER_ADMIN_ERRORS,
  PROFILE_ERRORS,
  SHARED_ERRORS,
  STORAGE_ERRORS,
  MAINTENANCE_ERRORS,
  NOTIFICATION_ERRORS,
};

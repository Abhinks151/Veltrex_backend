import { AUTH_SUCCESS } from './auth.success';
import { TENANT_SUCCESS } from './tenant.success';
import { SUBSCRIPTION_SUCCESS } from './subscription.success';
import { PAYMENT_SUCCESS } from './payment.success';
import { MACHINE_SUCCESS } from './machine.success';
import { FIXTURE_SUCCESS } from './fixture.success';
import { RAW_MATERIAL_SUCCESS } from './raw-material.success';
import { PART_SUCCESS } from './part.success';
import { JOB_SUCCESS } from './job.success';
import { NC_PROGRAM_SUCCESS } from './nc-program.success';
import { SHIFT_SUCCESS } from './shift.success';
import { SUPER_ADMIN_SUCCESS } from './super-admin.success';
import { PROFILE_SUCCESS } from './profile.success';

export const SUCCESS_MESSAGES = {
  ...AUTH_SUCCESS,
  ...TENANT_SUCCESS,
  ...SUBSCRIPTION_SUCCESS,
  ...PAYMENT_SUCCESS,
  ...MACHINE_SUCCESS,
  ...FIXTURE_SUCCESS,
  ...RAW_MATERIAL_SUCCESS,
  ...PART_SUCCESS,
  ...JOB_SUCCESS,
  ...NC_PROGRAM_SUCCESS,
  ...SHIFT_SUCCESS,
  ...SUPER_ADMIN_SUCCESS,
  ...PROFILE_SUCCESS,
} as const;

export {
  AUTH_SUCCESS,
  TENANT_SUCCESS,
  SUBSCRIPTION_SUCCESS,
  PAYMENT_SUCCESS,
  MACHINE_SUCCESS,
  FIXTURE_SUCCESS,
  RAW_MATERIAL_SUCCESS,
  PART_SUCCESS,
  JOB_SUCCESS,
  NC_PROGRAM_SUCCESS,
  SHIFT_SUCCESS,
  SUPER_ADMIN_SUCCESS,
  PROFILE_SUCCESS,
};

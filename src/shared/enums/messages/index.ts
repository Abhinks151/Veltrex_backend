import { ERROR_MESSAGES } from './errors';
import { SUCCESS_MESSAGES } from './success';
import { VALIDATION_MESSAGES } from './validation';
import { INFO_MESSAGES } from './info';

export const MESSAGE_CONSTANTS = {
  ERROR: ERROR_MESSAGES,
  SUCCESS: SUCCESS_MESSAGES,
  VALIDATION: VALIDATION_MESSAGES,
  INFO: INFO_MESSAGES,
} as const;

export * from './errors';
export * from './success';
export * from './validation';
export * from './info';

import { CRON_INFO } from './cron.info';
import { REDIS_INFO } from './redis.info';

export const INFO_MESSAGES = {
  ...CRON_INFO,
  ...REDIS_INFO,
} as const;

export { CRON_INFO, REDIS_INFO };

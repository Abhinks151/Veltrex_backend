export const REDIS_KEYS = {
  AUTH: {
    PASSWORD_RESET: {
      TOKEN: 'veltrex:auth:pwd_reset:token:',
      USER: 'veltrex:auth:pwd_reset:user:',
    },
    EMAIL_VERIFY: {
      TOKEN: 'veltrex:auth:email_verify:token:',
      USER: 'veltrex:auth:email_verify:user:',
    },
  },
} as const;

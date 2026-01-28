export const ACCOUNT_FOR = {
  SELF: 'SELF',
  CUSTOMER: 'CUSTOMER',
} as const;

export type AccountFor = (typeof ACCOUNT_FOR)[keyof typeof ACCOUNT_FOR];

export const COMMUNICATION_MODE = {
  SMS: 'SMS',
  EMAIL: 'EMAIL',
  WHATS_APP: 'WHATS_APP',
} as const;

export type PreferredCommunication = (typeof COMMUNICATION_MODE)[keyof typeof COMMUNICATION_MODE];

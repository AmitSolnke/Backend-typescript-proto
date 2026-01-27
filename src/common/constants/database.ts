export const DATABASE = {
  PROD: 'ticket_testing',
  UAT: 'ticket_testing',
  DEV: 'ticket_testing',
} as const;
export type DatabaseName = (typeof DATABASE)[keyof typeof DATABASE];

export const TABLES = {
  USERS: 'users',
  ROLES: 'roles',
  SESSIONS: 'sessions',
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];

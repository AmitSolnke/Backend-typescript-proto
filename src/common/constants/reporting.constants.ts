export const REPORTING_TYPE = {
  REPORTING_TO: 'REPORTING_TO',
  REPORTING_MANAGER: 'REPORTING_MANAGER',
} as const;

export type ReportingType = (typeof REPORTING_TYPE)[keyof typeof REPORTING_TYPE];

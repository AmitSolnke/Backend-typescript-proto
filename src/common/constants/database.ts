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
  EMPLOYEE: 'tai_employee_master',
  EMPLOYEE_DETAILS: 'tai_employee_details',
  EMPLOYEE_EDUCATION: 'hrms_emp_education_detail',
  EMPLOYEE_FAMILY: 'hrms_emp_family_detail',
  EMPLOYEE_PROFESSIONAL: 'hrms_emp_professional_detail',
  EMPLOYEE_JOINING: 'hrms_emp_joining_detail',
  EMPLOYEE_REPORTING: 'tai_hrms_reporting_managers',
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];

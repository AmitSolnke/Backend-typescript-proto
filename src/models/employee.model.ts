import { AccountFor, PreferredCommunication } from '../common/constants/employee.constants';

export interface Employee {
  id: number;

  tenant_id?: number | null;
  actual_tenant_id?: number | null;
  customer_id?: number | null;

  account_for?: AccountFor | null;
  employee_id?: number | null;

  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;

  email_id?: string | null;
  contact_no?: string | null;
  whats_app_contact_no?: string | null;

  role_id?: number | null;
  department_id?: number | null;
  designation_id?: number | null;
  job_role?: number | null;

  gender?: string | null;
  address?: string | null;

  city_id?: number | null;
  state_id?: number | null;
  country_id?: number | null;
  pincode?: string | null;

  profile_picture?: string | null;

  user_name?: string | null;
  password?: string | null;
  otp?: number | null;
  hash_key?: string | null;
  jwt_token?: string | null;

  last_login?: Date | null;
  password_changed_at?: Date | null;
  device_id?: string | null;

  view_format?: string | null;
  remark?: string | null;

  preferred_communication?: PreferredCommunication | null;

  hired_branch_id?: number | null;
  shift_type_id?: number | null;

  reporting_to?: number | null;
  reporting_manager_id?: number | null;

  is_active?: number; // int(11)
  is_superadmin?: number; // int(1)

  created_at?: Date | null;
  created_by?: number | null;
  updated_at?: Date | null;
  updated_by?: number | null;
}

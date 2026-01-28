export interface EmployeeDetails {
  id: number;

  tenant_id: number;
  emp_id: number;

  personal_email_id?: string | null;

  on_roll_type?: string | null;
  separation_mode?: string | null;
  employee_title?: string | null;

  dob?: string | null; // DATE → YYYY-MM-DD
  blood_group?: string | null;
  marital_status?: string | null;

  emergency_contact?: string | null;

  pan_no?: string | null;
  pan_photo?: string | null;

  aadhar_no?: string | null;
  aadhar_photo?: string | null;

  present_address?: string | null;
  permanent_address?: string | null;

  physically_handicapped?: number | null; // tinyint(1)

  is_active?: number; // tinyint(1)
  remark?: string | null;

  created_at?: Date | null;
  created_by?: number | null;
  updated_at?: Date | null;
  updated_by?: number | null;

  // duplicated lifecycle fields (legacy / reporting convenience)
  date_of_transfer?: string | null;
  date_of_promotion?: string | null;
  date_of_leaving?: string | null;
  notice_period?: number | null;
  doj?: string | null;
}

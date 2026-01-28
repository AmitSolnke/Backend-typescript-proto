export interface EmployeeFamilyDetail {
  id: number;

  tenant_id: number;
  emp_id: number;

  relation?: string | null;
  relative_name?: string | null;
  dob?: string | null; // DATE → string (YYYY-MM-DD)
  aadhar_no?: string | null;
  pan_no?: string | null;

  aadhar_photo?: string | null;
  pan_photo?: string | null;

  is_active?: number; // tinyint(1) → number (0 | 1)
  remark?: string | null;

  created_at?: Date | null;
  created_by?: number | null;
  updated_at?: Date | null;
  updated_by?: number | null;
}

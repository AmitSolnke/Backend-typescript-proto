export interface EmployeeProfessionalDetail {
  id: number;

  tenant_id: number;
  emp_id: number;

  experience?: number | null; // decimal(5,2)
  city?: string | null;
  company?: string | null;
  designation?: string | null;
  office_contact_no?: string | null;

  from_date?: string | null; // DATE → string (YYYY-MM-DD)
  to_date?: string | null; // DATE → string (YYYY-MM-DD)

  is_active?: number;
  remark?: string | null;

  created_at?: Date | null;
  created_by?: number | null;
  updated_at?: Date | null;
  updated_by?: number | null;
}

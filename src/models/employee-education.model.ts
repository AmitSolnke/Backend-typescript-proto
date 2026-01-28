export interface EmployeeEducation {
  id: number;

  tenant_id: number;
  emp_id: number;

  university?: string | null;
  passing_year?: number | null;
  course_name?: string | null;
  grade?: string | null;

  is_active?: number;
  remark?: string | null;

  created_at?: Date | null;
  created_by?: number | null;
  updated_at?: Date | null;
  updated_by?: number | null;
}

export interface EmployeeJoiningDetail {
  id: number;

  tenant_id: number;
  emp_id: number;

  doj?: string | null; // date → YYYY-MM-DD
  date_of_transfer?: string | null;
  date_of_promotion?: string | null;
  date_of_leaving?: string | null;

  notice_period?: number | null;

  designation_effective_date?: string | null;
  department_effective_date?: string | null;
  branch_effective_date?: string | null;

  emp_reference?: string | null;

  is_active?: number;
  remark?: string | null;

  created_at?: Date | null;
  created_by?: number | null;
  updated_at?: Date | null;
  updated_by?: number | null;
}

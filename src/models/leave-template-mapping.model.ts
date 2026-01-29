export interface LeaveTemplateMapping {
  id?: number;

  tenant_id: number;
  emp_id: number;
  leave_template_id: number;

  is_active?: number;
  remark?: string | null;

  created_at?: Date;
  created_by?: number;

  updated_at?: Date;
  updated_by?: number;
}

import { ReportingType } from '../common/constants/reporting.constants';

export interface EmployeeReportingManager {
  id: number;

  tenant_id?: number | null;

  emp_id?: number | null;
  reporting_manager?: number | null;

  type?: ReportingType | null;

  is_active?: number; // int(11) → number (0 | 1)

  created_at?: Date | null;
  created_by?: number | null;
  updated_at?: Date | null;
  updated_by?: number | null;
}

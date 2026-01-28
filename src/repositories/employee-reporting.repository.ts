import { db } from '../database/knex';

import { EmployeeReportingManager } from '../models/employee-reporting.model';

import { REPORTING_TYPE } from '../common/constants/reporting.constants';
import { TABLES } from '@common/constants/database';

export class EmployeeReportingRepository {
  private readonly table = TABLES.EMPLOYEE_REPORTING;

  async findByEmployee(tenantId: number, empId: number): Promise<EmployeeReportingManager[]> {
    return db<EmployeeReportingManager>(this.table).where({
      tenant_id: tenantId,
      emp_id: empId,
      is_active: 1,
    });
  }

  async findByManager(tenantId: number, managerId: number): Promise<EmployeeReportingManager[]> {
    return db<EmployeeReportingManager>(this.table).where({
      tenant_id: tenantId,
      reporting_manager: managerId,
      is_active: 1,
    });
  }

  async findByEmployeeAndType(
    tenantId: number,
    empId: number,
    type: keyof typeof REPORTING_TYPE,
  ): Promise<EmployeeReportingManager | undefined> {
    return db<EmployeeReportingManager>(this.table)
      .where({
        tenant_id: tenantId,
        emp_id: empId,
        type,
        is_active: 1,
      })
      .first();
  }
  async findAllByEmployeeAndType(
    tenantId: number,
    empId: number,
    type: keyof typeof REPORTING_TYPE,
  ): Promise<EmployeeReportingManager[] | undefined> {
    return db<EmployeeReportingManager>(this.table).where({
      tenant_id: tenantId,
      emp_id: empId,
      type,
      is_active: 1,
    });
  }

  async create(payload: any): Promise<number> {
    console.log('Payload in Employee Reporting Repository Create:', payload);
    const [id] = await db(this.table).insert(payload);
    return id;
  }

  async update(tenantId: number, id: number, payload: any): Promise<number> {
    return db(this.table)
      .where({ tenant_id: tenantId, id })
      .update({
        ...payload,
        updated_at: new Date(),
      });
  }

  async softDelete(tenantId: number, id: number, updatedBy: number): Promise<number> {
    return db(this.table).where({ tenant_id: tenantId, id }).update({
      is_active: 0,
      updated_by: updatedBy,
      updated_at: new Date(),
    });
  }
  async deactivateByEmployeeAndType(
    tenantId: number,
    empId: number,
    type: string,
    userId: number,
    now: Date,
  ) {
    return db(this.table)
      .where({
        tenant_id: tenantId,
        emp_id: empId,
        type,
        is_active: 1,
      })
      .update({
        is_active: 0,
        updated_at: now,
        updated_by: userId,
      });
  }
}

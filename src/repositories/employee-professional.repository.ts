import { TABLES } from '@common/constants/database';
import { db } from '../database/knex';

import { EmployeeProfessionalDetail } from '../models/employee-professional.model';

export class EmployeeProfessionalRepository {
  private readonly table = TABLES.EMPLOYEE_PROFESSIONAL;

  async findByEmployee(tenantId: number, empId: number): Promise<EmployeeProfessionalDetail[]> {
    return db<EmployeeProfessionalDetail>(this.table)
      .where({
        tenant_id: tenantId,
        emp_id: empId,
        is_active: 1,
      })
      .orderBy('from_date', 'desc');
  }

  async findById(tenantId: number, id: number): Promise<EmployeeProfessionalDetail | undefined> {
    return db<EmployeeProfessionalDetail>(this.table).where({ tenant_id: tenantId, id }).first();
  }

  async create(payload: any): Promise<number> {
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
  async deactivateByEmployee(tenantId: number, empId: number, userId: number, now: Date) {
    return db(this.table)
      .where({
        tenant_id: tenantId,
        emp_id: empId,
        is_active: 1,
      })
      .update({
        is_active: 0,
        updated_at: now,
        updated_by: userId,
      });
  }
}

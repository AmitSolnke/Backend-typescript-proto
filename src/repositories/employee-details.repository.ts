import { TABLES } from '@common/constants/database';
import { db } from '../database/knex';

import { EmployeeDetails } from '../models/employee-details.model';

export class EmployeeDetailsRepository {
  private readonly table = TABLES.EMPLOYEE_DETAILS;

  async findByEmployee(tenantId: number, empId: number): Promise<EmployeeDetails | undefined> {
    return db<EmployeeDetails>(this.table)
      .where({
        tenant_id: tenantId,
        emp_id: empId,
        is_active: 1,
      })
      .first();
  }

  async findById(tenantId: number, id: number): Promise<EmployeeDetails | undefined> {
    return db<EmployeeDetails>(this.table).where({ tenant_id: tenantId, id }).first();
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
}

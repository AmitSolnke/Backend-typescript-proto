import { TABLES } from '../common/constants/database';
import { db } from '../database/knex';

import { Employee } from '../models/employee.model';

export class EmployeeRepository {
  private readonly table = TABLES.EMPLOYEE;

  async findById(tenantId: number, id: number): Promise<Employee | undefined> {
    return db<Employee>(this.table)
      .where({
        tenant_id: tenantId,
        id,
        is_active: 1,
      })
      .first();
  }

  async findByUsername(tenantId: number, userName: string): Promise<Employee | undefined> {
    return db<Employee>(this.table)
      .where({
        tenant_id: tenantId,
        user_name: userName,
        is_active: 1,
      })
      .first();
  }

  async create(payload: any): Promise<number> {
    console.log('Payload in Employee Repository Create:', payload);
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

  async updateLastLogin(tenantId: number, id: number): Promise<number> {
    return db(this.table).where({ tenant_id: tenantId, id }).update({
      last_login: new Date(),
    });
  }
  async findAuthUserById(id: number): Promise<{
    id: number;
    tenant_id: number;
    employee_id: number;
  } | null> {
    return db(this.table).select('id', 'tenant_id', 'employee_id').where({ id }).first();
  }

  async findAll(tenantId: number): Promise<Employee[] | undefined> {
    return db<Employee>(this.table)
      .where({
        tenant_id: tenantId,
        is_active: 1,
      })
      .orderBy('id', 'desc');
  }
}

import { LeaveTemplateMapping } from '@models/leave-template-mapping.model';
import { db } from 'database/knex';

const TABLE = 'hrms_leave_template_mapping_master';

export class LeaveTemplateMappingRepository {
  async create(data: Partial<LeaveTemplateMapping>): Promise<number> {
    const [id] = await db(TABLE).insert(data);
    return id;
  }

  async deactivateExisting(
    tenant_id: number,
    emp_id: number,
    updated_by: number,
    updated_at: Date,
  ): Promise<void> {
    await db(TABLE).where({ tenant_id, emp_id, is_active: 1 }).update({
      is_active: 0,
      updated_by,
      updated_at,
    });
  }

  async findActiveByEmployee(
    tenant_id: number,
    emp_id: number,
  ): Promise<LeaveTemplateMapping[] | undefined> {
    return db(TABLE).where({ tenant_id, emp_id, is_active: 1 });
  }
  async findById(tenant_id: number, emp_id: number): Promise<LeaveTemplateMapping | undefined> {
    return db(TABLE).where({ tenant_id, emp_id, is_active: 1 }).first();
  }

  async findAllByEmployee(tenant_id: number, emp_id: number): Promise<LeaveTemplateMapping[]> {
    return db(TABLE).where({ tenant_id, emp_id }).orderBy('created_at', 'desc');
  }
  async findByIds(
    tenant_id: number,
    ids: number[],
  ): Promise<
    {
      id: number;
      leave_template_id: number;
      leave_template_name: string;
    }[]
  > {
    console.log('ids', ids);
    if (!ids.length) {
      return [];
    }

    return db('hrms_leave_template_mapping_master as ltm')
      .innerJoin('hrms_leave_template_master as ltmst', 'ltmst.id', 'ltm.leave_template_id')
      .select('ltm.id', 'ltm.leave_template_id', 'ltmst.leave_template_name')
      .where('ltm.tenant_id', tenant_id)
      .whereIn('ltm.leave_template_id', ids);
  }
}

import { Knex } from 'knex';
import { logger } from '../logger/pino.logger';

import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeeDetailsRepository } from '../repositories/employee-details.repository';
import { EmployeeJoiningRepository } from '../repositories/employee-joining.repository';
import { EmployeeEducationRepository } from '../repositories/employee-education.repository';
import { EmployeeProfessionalRepository } from '../repositories/employee-professional.repository';
import { EmployeeFamilyRepository } from '../repositories/employee-family.repository';
import { EmployeeReportingRepository } from '../repositories/employee-reporting.repository';
import { REPORTING_TYPE } from '../common/constants/reporting.constants';

interface EmployeeAggregateInput {
  employeeId: number;
  body: any;
  //files: Express.Multer.File[];
}
interface CreateEmployeeAggregateInput {
  body: any;
  //files: Express.Multer.File[];
}

export class EmployeeService {
  private employeeRepo: EmployeeRepository;
  private detailsRepo: EmployeeDetailsRepository;
  private joiningRepo: EmployeeJoiningRepository;
  private educationRepo: EmployeeEducationRepository;
  private professionalRepo: EmployeeProfessionalRepository;
  private familyRepo: EmployeeFamilyRepository;
  private reportingRepo: EmployeeReportingRepository;

  constructor(private trx?: Knex.Transaction) {
    this.employeeRepo = new EmployeeRepository();
    this.detailsRepo = new EmployeeDetailsRepository();
    this.joiningRepo = new EmployeeJoiningRepository();
    this.educationRepo = new EmployeeEducationRepository();
    this.professionalRepo = new EmployeeProfessionalRepository();
    this.familyRepo = new EmployeeFamilyRepository();
    this.reportingRepo = new EmployeeReportingRepository();
  }

  async upsertEmployeeAggregate(input: EmployeeAggregateInput) {
    const { employeeId, body } = input;
    const now = new Date();

    logger.info({ employeeId }, 'Upserting employee master');

    /* ---------------- EMPLOYEE MASTER ---------------- */
    await this.employeeRepo.update(body.tenant_id, employeeId, {
      employee_id: body.employee_id,

      first_name: body.first_name,
      middle_name: body.middle_name,
      last_name: body.last_name,
      email_id: body.email_id,
      pincode: body.pincode,

      contact_no: body.contact_no,
      whats_app_contact_no: body.whats_app_contact_no,

      role_id: body.job_role,
      gender: body.gender,
      department_id: body.department,
      designation_id: body.designation_id,
      job_role: body.job_role,
      profile_picture: body.profile_picture,
      country_id: body.country_id,
      state_id: body.state_id,
      city_id: body.city_id,
      shift_type_id: body.shift_type_id,
      hired_branch_id: body.hired_branch_id,

      account_for: body.account_for,
      user_name: body.user_name,

      is_active: body.is_active ?? 1,

      updated_by: body.updated_by,
      updated_at: now,
    });

    /* ---------------- EMPLOYEE DETAILS ---------------- */
    await this.detailsRepo.update(body.tenant_id, employeeId, {
      personal_email_id: body.personal_email_id,

      dob: body.dob,
      blood_group: body.blood_group,
      marital_status: body.marital_status,

      emergency_contact: body.emergency_contact,
      present_address: body.present_address,
      permanent_address: body.permanent_address,
      separation_mode: body.separation_mode,
      aadhar_no: body.aadhar_no,
      pan_no: body.pan_no,
      physically_handicapped: body.physically_handicapped === 'YES' ? 1 : 0,
      doj: body.doj,
      date_of_transfer: body.date_of_transfer,
      date_of_promotion: body.date_of_promotion,
      date_of_leaving: body.date_of_leaving,
      notice_period: body.notice_period,

      updated_by: body.updated_by,
      updated_at: now,
    });

    /* ---------------- JOINING DETAILS ---------------- */
    await this.joiningRepo.update(body.tenant_id, employeeId, {
      doj: body.doj,
      date_of_transfer: body.date_of_transfer,
      date_of_promotion: body.date_of_promotion,
      date_of_leaving: body.date_of_leaving,
      notice_period: body.notice_period,
      emp_reference: body.employee_reference,
      updated_by: body.updated_by,
      updated_at: now,
    });

    /* ---------------- REPORTING MANAGERS ---------------- */
    /**
     * IMPORTANT:
     * We CREATE new rows instead of UPDATE because
     * reporting is relationship history, not state.
     */

    if (body.reporting_to) {
      await this.reportingRepo.create({
        tenant_id: body.tenant_id,
        emp_id: employeeId,
        reporting_manager: body.reporting_to,
        type: REPORTING_TYPE.REPORTING_TO,

        created_by: body.updated_by,
        created_at: now,
      });
    }

    if (body.leave_auth_manager) {
      for (const auth_manager of body.leave_auth_manager) {
        await this.reportingRepo.create({
          tenant_id: body.tenant_id,
          emp_id: employeeId,
          reporting_manager: auth_manager,
          type: REPORTING_TYPE.LEAVE_AUTH_MANAGER,
          created_by: body.created_by,
          created_at: now,
        });
      }
    }

    /* ---------------- EDUCATION ---------------- */
    /**
     * NOTE:
     * Legacy behavior = append-only.
     * No delete/update logic added here intentionally.
     */
    if (Array.isArray(body.educational_details)) {
      for (const edu of body.educational_details) {
        await this.educationRepo.create({
          tenant_id: body.tenant_id,
          emp_id: employeeId,

          course_name: edu.course_name,
          university: edu.university,
          passing_year: edu.passing_year,
          grade: edu.grade,

          created_at: now,
        });
      }
    }

    /* ---------------- PROFESSIONAL ---------------- */
    if (Array.isArray(body.professional_details)) {
      for (const prof of body.professional_details) {
        await this.professionalRepo.create({
          tenant_id: body.tenant_id,
          emp_id: employeeId,

          company: prof.company,
          designation: prof.designation,
          city: prof.city,
          experience: prof.experience,
          from_date: prof.from_date,
          to_date: prof.to_date,

          created_at: now,
        });
      }
    }

    /* ---------------- FAMILY ---------------- */
    if (Array.isArray(body.family_details)) {
      for (const fam of body.family_details) {
        await this.familyRepo.create({
          tenant_id: body.tenant_id,
          emp_id: employeeId,

          relation: fam.relation,
          relative_name: fam.name,
          dob: fam.dob,

          created_at: now,
        });
      }
    }

    logger.info({ employeeId }, 'Employee aggregate upsert completed');
  }

  async createEmployeeAggregate(input: CreateEmployeeAggregateInput): Promise<number> {
    console.log('Creating employee aggregate with input:', input);
    const { body } = input;
    const now = new Date();

    /* ---------------- EMPLOYEE MASTER ---------------- */
    const employeeId = await this.employeeRepo.create({
      tenant_id: body.tenant_id,
      actual_tenant_id: body.tenant_id,
      account_for: body.account_for,
      employee_id: body.employee_id,

      pincode: body.pincode,
      country_id: body.country_id,
      first_name: body.first_name,
      middle_name: body.middle_name,
      last_name: body.last_name,
      email_id: body.email_id,

      contact_no: body.contact_no,
      whats_app_contact_no: body.whats_app_contact_no,
      role_id: body.job_role,
      gender: body.gender,
      department_id: body.department,
      job_role: body.job_role,
      profile_picture: body.profile_picture,
      state_id: body.state_id,
      city_id: body.city_id,
      shift_type_id: body.shift_type_id,
      designation_id: body.designation_id,
      hired_branch_id: body.hired_branch_id,
      is_active: body.is_active ?? 1,

      created_by: body.created_by,
      created_at: now, // ✅ added
      updated_at: now,
    });

    /* ---------------- EMPLOYEE DETAILS ---------------- */
    await this.detailsRepo.create({
      tenant_id: body.tenant_id,
      emp_id: employeeId,
      personal_email_id: body.personal_email_id,
      dob: body.dob,
      blood_group: body.blood_group,
      marital_status: body.marital_status,
      emergency_contact: body.emergency_contact,
      present_address: body.present_address,
      permanent_address: body.permanent_address,
      employee_title: body.employee_title,
      separation_mode: body.separation_mode,

      aadhar_no: body.aadhar_no,
      pan_no: body.pan_no,
      doj: body.doj,
      date_of_transfer: body.date_of_transfer,
      date_of_promotion: body.date_of_promotion,
      date_of_leaving: body.date_of_leaving,
      notice_period: body.notice_period,

      physically_handicapped: body.physically_handicapped === 'YES' ? 1 : 0,

      created_by: body.updated_by,
      created_at: now, // ✅ added
      updated_at: now,
    });

    /* ---------------- JOINING DETAILS ---------------- */
    await this.joiningRepo.create({
      tenant_id: body.tenant_id,
      emp_id: employeeId,
      emp_reference: body.employee_reference,
      doj: body.doj,
      date_of_transfer: body.date_of_transfer,
      date_of_promotion: body.date_of_promotion,
      date_of_leaving: body.date_of_leaving,
      notice_period: body.notice_period,
      created_by: body.updated_by,
      updated_at: now,
    });

    /* ---------------- REPORTING ---------------- */
    if (body.reporting_to) {
      await this.reportingRepo.create({
        tenant_id: body.tenant_id,
        emp_id: employeeId,
        reporting_manager: body.reporting_to,
        type: REPORTING_TYPE.REPORTING_TO,
        created_by: body.created_by,
        created_at: now,
        updated_at: now,
      });
    }

    if (Array.isArray(body.leave_auth_manager)) {
      for (const auth_manager of body.leave_auth_manager) {
        await this.reportingRepo.create({
          tenant_id: body.tenant_id,
          emp_id: employeeId,
          reporting_manager: auth_manager,
          type: REPORTING_TYPE.LEAVE_AUTH_MANAGER,
          created_by: body.created_by,
          created_at: now,
          updated_at: now,
        });
      }
    }

    /* ---------------- EDUCATION ---------------- */
    if (Array.isArray(body.educational_details)) {
      for (const edu of body.educational_details) {
        await this.educationRepo.create({
          tenant_id: body.tenant_id,
          emp_id: employeeId,
          course_name: edu.course_name,
          university: edu.university,
          passing_year: edu.passing_year,
          grade: edu.grade,
          created_at: now,
          updated_at: now,
        });
      }
    }

    /* ---------------- PROFESSIONAL ---------------- */
    if (Array.isArray(body.professional_details)) {
      for (const prof of body.professional_details) {
        await this.professionalRepo.create({
          tenant_id: body.tenant_id,
          emp_id: employeeId,
          company: prof.company,
          designation: prof.designation,
          city: prof.city,
          experience: prof.experience,
          from_date: prof.from_date,
          to_date: prof.to_date,
          created_at: now,
          updated_at: now,
        });
      }
    }

    /* ---------------- FAMILY ---------------- */
    if (Array.isArray(body.family_details)) {
      for (const fam of body.family_details) {
        await this.familyRepo.create({
          tenant_id: body.tenant_id,
          emp_id: employeeId,
          relation: fam.relation,
          relative_name: fam.name,
          dob: fam.dob,
          created_at: now,
          updated_at: now,
        });
      }
    }

    logger.info({ employeeId }, 'Employee aggregate created successfully');

    return employeeId;
  }
  private async resolveEmployeeName(tenantId: number, empId: number): Promise<string | null> {
    const emp = await this.employeeRepo.findById(tenantId, empId);

    if (!emp) return null;

    return `${emp.first_name ?? ''} ${emp.last_name ?? ''}`.trim();
  }
  async getEmployeeAggregate(tenantId: number, employeeId: number) {
    logger.info({ employeeId }, 'Fetching employee aggregate');

    /* ---------------- EMPLOYEE MASTER ---------------- */
    const employee = await this.employeeRepo.findById(tenantId, employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    /* ---------------- PARALLEL CHILD FETCH ---------------- */
    const [
      employeeDetails,
      joiningDetails,
      professionalDetails,
      educationalDetails,
      familyDetails,
      reportingTo,
      leaveAuthManagers,
    ] = await Promise.all([
      this.detailsRepo.findByEmployee(tenantId, employeeId),
      this.joiningRepo.findByEmployee(tenantId, employeeId),
      this.professionalRepo.findByEmployee(tenantId, employeeId),
      this.educationRepo.findByEmployee(tenantId, employeeId),
      this.familyRepo.findByEmployee(tenantId, employeeId),
      this.reportingRepo.findByEmployeeAndType(tenantId, employeeId, REPORTING_TYPE.REPORTING_TO),
      this.reportingRepo.findAllByEmployeeAndType(
        tenantId,
        employeeId,
        REPORTING_TYPE.LEAVE_AUTH_MANAGER,
      ),
    ]);

    /* ---------------- REPORTING NAME RESOLUTION ---------------- */
    const reportingToName = reportingTo
      ? reportingTo.reporting_manager &&
        (await this.resolveEmployeeName(tenantId, reportingTo.reporting_manager))
      : null;

    const leaveAuthManagerNames = leaveAuthManagers
      ? await Promise.all(
          leaveAuthManagers.map(async (mgr) => ({
            id: mgr.reporting_manager,
            name: mgr.reporting_manager
              ? await this.resolveEmployeeName(tenantId, mgr.reporting_manager)
              : null,
          })),
        )
      : [];

    /* ---------------- RESPONSE SHAPING ---------------- */
    return {
      id: employee.id,
      tenant_id: employee.tenant_id,
      actual_tenant_id: employee.actual_tenant_id,
      employee_id: employee.employee_id,
      account_for: employee.account_for,
      customer_id: employee.customer_id,

      first_name: employee.first_name,
      middle_name: employee.middle_name,
      last_name: employee.last_name,
      email_id: employee.email_id,

      preferred_communication: employee.preferred_communication,
      whats_app_contact_no: employee.whats_app_contact_no,
      contact_no: employee.contact_no,

      role_id: employee.role_id,
      designation_id: employee.designation_id,
      gender: employee.gender,

      address: employee.address,
      city_id: employee.city_id,
      state_id: employee.state_id,
      country_id: employee.country_id,
      pincode: employee.pincode,

      user_name: employee.user_name,
      password: null,

      profile_picture: employee.profile_picture ?? '',
      job_role: employee.job_role,

      is_active: employee.is_active,
      created_at: employee.created_at,
      updated_at: employee.updated_at,
      created_by: employee.created_by,
      updated_by: employee.updated_by,

      department_id: employee.department_id,
      department: [],

      role: null,
      jobRole: null, // lookup table pending

      branch_id: employee.hired_branch_id,
      branch_name: null, // lookup pending

      shift_type_id: employee.shift_type_id,
      shift_type_name: null, // lookup pending

      reporting_to_id: reportingTo?.reporting_manager ?? null,
      reporting_to_name: reportingToName,
      reporting_to_mangers: [],

      leave_auth_managers: leaveAuthManagerNames,

      customer_type_id: String(employee.customer_id ?? 1),
      leave_templates: [],

      professional_details: professionalDetails.map((p) => ({
        id: p.id,
        company: p.company,
        designation: p.designation,
        experience: p.experience,
        city: p.city,
        office_contact_no: p.office_contact_no,
        from_date: p.from_date,
        to_date: p.to_date,
      })),

      educational_details: educationalDetails.map((e) => ({
        id: e.id,
        university: e.university,
        passing_year: e.passing_year,
        course_name: e.course_name,
        grade: e.grade,
      })),

      family_details: familyDetails.map((f) => ({
        id: f.id,
        relation: f.relation,
        relative_name: f.relative_name,
        dob: f.dob,
        aadhar_no: f.aadhar_no,
        pan_no: f.pan_no,
        aadhar_photo: f.aadhar_photo,
        pan_photo: f.pan_photo,
      })),

      employee_details: {
        ...employeeDetails,
        ...joiningDetails,
      },

      employee_attachments: [],
    };
  }
}

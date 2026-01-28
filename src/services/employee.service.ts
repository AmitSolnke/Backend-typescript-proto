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

  constructor(private trx: Knex.Transaction) {
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
}

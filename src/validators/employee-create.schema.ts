import { z } from 'zod';
import { numberOrNull } from './zod.helpers';

export const createEmployeeSchema = z.object({
  tenant_id: numberOrNull(), // ← REQUIRED, but still comes as string
  employee_id: numberOrNull(),

  department: numberOrNull(),
  job_role: numberOrNull(),
  shift_type_id: numberOrNull(),
  designation_id: numberOrNull(),
  hired_branch_id: numberOrNull(),

  is_active: numberOrNull(),

  first_name: z.string().min(1),
  last_name: z.string().min(1),

  middle_name: z.string().optional().nullable(),
  email_id: z.string().optional().nullable(),

  // files (already resolved paths)
  profile_picture: z.string().optional().nullable(),
  pan_photo: z.string().optional().nullable(),
  aadhar_photo: z.string().optional().nullable(),

  educational_details: z
    .array(
      z.object({
        course_name: z.string(),
        university: z.string(),
        passing_year: numberOrNull(),
        grade: z.string().optional().nullable(),
      }),
    )
    .optional(),

  professional_details: z
    .array(
      z.object({
        company: z.string(),
        designation: z.string(),
        city: z.string().optional().nullable(),
        experience: numberOrNull(),
        from_date: z.string(),
        to_date: z.string().optional().nullable(),
      }),
    )
    .optional(),
});

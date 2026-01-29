import { Request, Response } from 'express';
import { db } from '../database/knex';
import { StatusCodes } from '../common/constants/http-status';

import { logger } from '../logger/pino.logger';

import { EmployeeService } from '../services/employee.service';
import { extractEmployeeFilePaths, MulterFieldFiles } from '../common/utils/file-upload.util';
import { buildSuccessResponse } from '../common/utils/response.util';

export const postEmployeeMaster = async (req: Request, res: Response) => {
  const employeeId = Number(req.params.employeeId);

  logger.info({ employeeId }, 'Employee master POST initiated');
  const files = req.files;
  const filePaths = extractEmployeeFilePaths(files as MulterFieldFiles);
  const userId = req.userId;
  const tenantId = req.tenantId;
  if (!userId) {
    throw new Error('User ID is required');
  }

  await db.transaction(async (trx) => {
    const service = new EmployeeService(trx);

    await service.upsertEmployeeAggregate({
      employeeId,
      body: { ...req.body, ...filePaths },
      userId: userId,
      tenantId: tenantId ?? 1,
    });
  });

  res.status(StatusCodes.OK).send(buildSuccessResponse(null, 'Employee record saved successfully'));
};

export const createEmployeeMaster = async (req: Request, res: Response) => {
  logger.info('Employee master CREATE initiated');

  const filePaths = extractEmployeeFilePaths(req.files as MulterFieldFiles);

  let employeeId: number;
  const userId = req.userId;
  const tenantId = req.tenantId;
  if (!userId) {
    throw new Error('User ID is required');
  }

  console.log('filePaths', filePaths);

  await db.transaction(async (trx) => {
    const service = new EmployeeService(trx);

    employeeId = await service.createEmployeeAggregate({
      body: { ...req.body, ...filePaths },
      userId: req.userId!,
      tenantId: tenantId ?? 1,
    });
  });

  res
    .status(StatusCodes.CREATED)
    .send(buildSuccessResponse({ employee_id: employeeId! }, 'Employee created successfully'));
};

export const getEmployee = async (req: Request, res: Response) => {
  const employeeId = Number(req.params.employeeId);
  const tenantId = Number(req.query.tenant_id ?? 1);

  const service = new EmployeeService();
  const data = await service.getEmployeeAggregate(tenantId, employeeId);

  res.status(200).send({
    status: 1,
    message: 'Record Found',
    data: { data },
  });
};

export const getAllEmployees = async (req: Request, res: Response) => {
  const tenantId = Number(req.tenantId ?? 1);

  const service = new EmployeeService();

  const data = await service.getAllEmployees({
    tenantId,
  });

  res.status(200).send({
    status: 1,
    message: 'Record Found',
    data: {
      data,
    },
  });
};

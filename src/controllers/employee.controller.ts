import { Request, Response } from 'express';
import { db } from '../database/knex';
import { StatusCodes } from '../common/constants/http-status';

import { logger } from '../logger/pino.logger';

import { EmployeeService } from '../services/employee.service';
import { buildSuccessResponse } from '@common/utils/response.util';

export const postEmployeeMaster = async (req: Request, res: Response) => {
  const employeeId = Number(req.params.employeeId);

  logger.info({ employeeId }, 'Employee master POST initiated');

  await db.transaction(async (trx) => {
    const service = new EmployeeService(trx);

    await service.upsertEmployeeAggregate({
      employeeId,
      body: req.body,
      // files: req.files as Express.Multer.File[],
    });
  });

  res.status(StatusCodes.OK).send(buildSuccessResponse(null, 'Employee record saved successfully'));
};

export const createEmployeeMaster = async (req: Request, res: Response) => {
  logger.info('Employee master CREATE initiated');

  let employeeId: number;
  console.log(req.body, 'req.body');

  await db.transaction(async (trx) => {
    const service = new EmployeeService(trx);

    employeeId = await service.createEmployeeAggregate({
      body: req.body,
      // files: req.files as Express.Multer.File[],
    });
  });

  res
    .status(StatusCodes.CREATED)
    .send(buildSuccessResponse({ employee_id: employeeId! }, 'Employee created successfully'));
};

import { Request, Response } from 'express';
import { UserService } from '@services/user.service';
import { buildSuccessResponse } from '@common/utils/response.util';
import { StatusCodes } from '@common/constants/http-status';

import { logger } from 'logger/pino.logger';

type UserControllerDeps = {
  userService: UserService;
  //authService: AuthService;
};

export class UserController {
  constructor(private readonly deps: UserControllerDeps) {}

  getUsers = async (_req: Request, res: Response) => {
    try {
      logger.info('Fetching users');
      const users = await this.deps.userService.getUsers();

      logger.info({ count: users.length }, 'Users fetched successfully');

      const response = buildSuccessResponse(users, 'Users fetched successfully');

      res.status(StatusCodes.OK).send(response);
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.warn({ err: err.message }, 'Failed to fetch users due to client error');

        res.status(StatusCodes.BAD_REQUEST).send({
          success: false,
          message: err.message,
        });
      } else {
        logger.error({ err }, 'Unexpected error while fetching users');

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          success: false,
          message: 'Internal Server Error',
        });
      }
    }
  };

  postEmployee = async (req: Request, res: Response) => {};
}

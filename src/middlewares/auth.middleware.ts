import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { EmployeeRepository } from '../repositories/employee.repository';
import { StatusCodes } from '../common/constants/http-status';
import { logger } from '../logger/pino.logger';
import { env } from '../config/env';

interface AuthTokenPayload extends JwtPayload {
  sub: string; // user id
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      tenantId?: number;
      employeeId?: number;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  /* ---------- Token presence ---------- */
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];

  /* ---------- JWT verification ---------- */
  let decoded: AuthTokenPayload;

  try {
    decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  } catch (err) {
    logger.warn({ err }, 'Invalid or expired JWT token');

    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
  }

  const userId = Number(decoded.sub);

  /* ---------- DB lookup ---------- */
  try {
    const employeeRepo = new EmployeeRepository();

    const user = await employeeRepo.findAuthUserById(userId);

    if (!user) {
      logger.warn({ userId }, 'Authenticated user not found in DB');

      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found' });
    }

    req.userId = user.id;
    req.tenantId = user.tenant_id;
    req.employeeId = user.employee_id;

    next();
  } catch (err) {
    logger.error({ err }, 'Database error during auth middleware');

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Database connection failed' });
  }
};

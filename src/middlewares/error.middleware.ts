import { AppError } from '@common/errors/app-error';
import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}

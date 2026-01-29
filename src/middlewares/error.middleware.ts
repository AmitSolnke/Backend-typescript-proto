import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors/app-error';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status((err as AppError).statusCode).json({
      success: false,
      message: (err as AppError).message,
    });
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}

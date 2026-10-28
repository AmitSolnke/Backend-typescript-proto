import { Express } from 'express';
import { userRoutes } from './modules/user';
import { employeeRoutes } from './modules/employee';

export function registerRoutes(app: Express) {
  app.use('/users', userRoutes());
  app.use('/employee', employeeRoutes());
}

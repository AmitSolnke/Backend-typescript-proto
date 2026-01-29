import { Express } from 'express';
import { userRoutes } from './routes/user.routes';
import { employeeRoutes } from './routes/employee.routes';

export function registerRoutes(app: Express) {
  app.use('/users', userRoutes());
  app.use('/employee', employeeRoutes());
}

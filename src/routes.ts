import { Express } from 'express';
import { userRoutes } from './routes/user.routes';

export function registerRoutes(app: Express) {
  app.use('/users', userRoutes());
}

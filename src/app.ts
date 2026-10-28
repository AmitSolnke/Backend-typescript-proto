import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { registerRoutes } from './routes';

import { notFoundMiddleware } from './common/middlewares/not-found.middleware';
import { errorMiddleware } from './common/middlewares/error.middleware';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());

  registerRoutes(app);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

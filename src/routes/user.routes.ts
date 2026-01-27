import { Router } from 'express';
import { createUserController } from '../modules/user.module';

export function userRoutes() {
  const router = Router();

  const controller = createUserController();

  router.get('/', controller.getUsers);

  return router;
}

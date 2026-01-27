import { UserRepository } from '../repositories/user.repository';
//import { AuthRepository } from '../repositories/auth.repository';

//import { AuthService } from '../services/auth.service';

import { UserController } from '../controllers/user.controller';
import { UserService } from '@services/user.service';

export function createUserController() {
  // repositories
  const userRepo = new UserRepository();
  // const authRepo = new AuthRepository();

  // services
  const userService = new UserService(userRepo);
  // const authService = new AuthService(authRepo);

  // controller
  return new UserController({
    userService,
    //  authService,
  });
}

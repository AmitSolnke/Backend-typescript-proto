import { UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  getUsers() {
    return this.repo.findAll();
  }
}

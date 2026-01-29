import { db } from '../database/knex';
import { User } from '../models/user.model';

export class UserRepository {
  async findAll(): Promise<User[]> {
    return db<User>('users').select('*');
  }
}

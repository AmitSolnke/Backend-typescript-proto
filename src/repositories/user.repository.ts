import { User } from '@models/user.model';
import { db } from '../database/knex';

export class UserRepository {
  async findAll(): Promise<User[]> {
    return db<User>('users').select('*');
  }
}

import type { Knex } from 'knex';
import { env } from './env';

export const databaseConfig: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: env.DB_HOST ?? 'localhost',
    user: env.DB_USER ?? 'root',
    password: env.DB_PASSWORD ?? '',
    database: env.DB_NAME ?? '',
    port: env.DB_PORT ? Number(env.DB_PORT) : 3306,
    dateStrings: true,
  },
};

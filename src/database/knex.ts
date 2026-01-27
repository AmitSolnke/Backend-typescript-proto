import knex from 'knex';
import { databaseConfig } from '../config/database.config';

export const db = knex(databaseConfig);

import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '~/server/database/schema';

export type Database = MySql2Database<typeof import('./schema')>;

let _db: Database | undefined;

export const useDatabase = () => {
  if (_db) {
    return _db;
  }

  const config = useRuntimeConfig();
  const connection = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
  });

  _db = drizzle(connection, {
    mode: 'default',
    logger: config.database.logs,
    casing: 'snake_case',
    schema,
  });

  return _db;
};

export * from './schema';

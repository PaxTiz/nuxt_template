import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import { migrate as runMigrations } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import * as schema from '~/server/database/schema';

export type Database = MySql2Database<typeof import('./schema')>;

let _db: Database | undefined;

const useDatabase = () => {
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
    schema,
  });

  return _db;
};

export const migrate = async (db: MySql2Database<Record<string, unknown>>) => {
  await runMigrations(db, { migrationsFolder: './server/database/drizzle' });
};

export default useDatabase;

export * from './schema';

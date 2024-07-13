import type { RuntimeConfig } from '@nuxt/schema';
import { FetchError } from 'ofetch';
import { type Database, useDatabase } from '~/server/database';

export abstract class Service {
  protected readonly config: RuntimeConfig;
  protected readonly database: Database;

  constructor() {
    this.config = useRuntimeConfig();
    this.database = useDatabase();
  }

  protected handleError(error: unknown): unknown {
    if (error instanceof FetchError) {
      return {
        data: error.data,
        message: error.message,
        status: error.status,
      };
    }

    return JSON.parse(JSON.stringify(error));
  }
}

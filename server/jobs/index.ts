import { and, eq, or, sql } from 'drizzle-orm';
import { useDatabase } from '../database';
import { type DatabaseJob, __jobs } from '../database/schema/__jobs';

export type Job = {
  name: string;

  /** Cron expression */
  runAt: string;

  handler: (args: DatabaseJob) => Promise<void>;
};

export const defineJob = (job: Job) => job;

export const queueJob = async ({
  name,
  data,
  fatal,
  retries,
}: {
  name: string;
  data: any;
  fatal?: boolean;
  retries?: number;
}) => {
  const database = useDatabase();
  await database.insert(__jobs).values({
    name,
    data,
    fatal,
    allowedRetries: retries,
  });
};

export const processJobs = async (handlers: Array<Job>, name?: string) => {
  const logger = useLogger('JOBS');
  const database = useDatabase();

  const jobs = await database.query.__jobs.findMany({
    where: and(
      or(eq(__jobs.status, 'pending'), eq(__jobs.status, 'retry')),
      name ? eq(__jobs.name, name) : undefined,
    ),
  });

  logger.info(`%d jobs to process`, jobs.length);

  for (const job of jobs) {
    const childLogger = useLogger(`JOBS:${job.name}`);
    childLogger.info(`processing job '%s'`, job.name);

    const handler = handlers.find((handler) => handler.name === job.name);
    if (!handler) {
      childLogger.error(`handler not found for job '%s'`, job.name);
      return;
    }

    try {
      await handler.handler(job);

      await database
        .update(__jobs)
        .set({ status: 'success', processedAt: new Date() })
        .where(eq(__jobs.id, job.id));

      childLogger.info(`job '%s' processed successfully`, job.name);
    } catch (e) {
      childLogger.error(`job '%s' failed`, job.name);

      if (job.fatal || job.currentRetries + 1 >= job.allowedRetries) {
        await database
          .update(__jobs)
          .set({
            status: 'failed',
            processedAt: null,
            currentRetries: job.allowedRetries,
          })
          .where(eq(__jobs.id, job.id));
      } else {
        await database
          .update(__jobs)
          .set({
            status: 'retry',
            currentRetries: sql`${__jobs.currentRetries} + 1`,
          })
          .where(eq(__jobs.id, job.id));
      }
    }
  }
};

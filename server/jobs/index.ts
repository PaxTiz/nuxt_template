import { eq, or, sql } from 'drizzle-orm';
import { useDatabase } from '../database';
import { type DatabaseJob, __jobs } from '../database/schema/__jobs';

export type Job = {
  name: string;
  handler: (args: DatabaseJob) => Promise<void>;
};

export const defineJob = (job: Job) => job;

export const addJob = async ({
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

export const processJobs = async (
  handlers: Array<{ name: string; handler: (args: any) => Promise<void> }>,
) => {
  const database = useDatabase();
  const jobs = await database.query.__jobs.findMany({
    where: or(eq(__jobs.status, 'pending'), eq(__jobs.status, 'retry')),
  });

  for (const job of jobs) {
    const handler = handlers.find((handler) => handler.name === job.name);
    if (!handler) {
      console.error(`[jobs] handler not found for job '${job.name}'`);
      continue;
    }

    try {
      await handler.handler(job);
      console.info(`[jobs] job '${job.name}' handled successfully`);

      await database
        .update(__jobs)
        .set({ status: 'success', processedAt: new Date() })
        .where(eq(__jobs.id, job.id));
    } catch (e) {
      console.error(`[jobs] job '${job.name}' failed`);

      if (job.fatal) {
        // TODO: Send error email
      }

      if (job.currentRetries + 1 >= job.allowedRetries) {
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

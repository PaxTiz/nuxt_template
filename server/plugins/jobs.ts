import { Cron } from 'croner';
import { type Job, processJobs } from '../jobs';
import { useLogger } from '../utils/useLogger';

export default defineNitroPlugin(async () => {
  const logger = useLogger('JOBS');

  const config = useRuntimeConfig();
  if (!config.jobs.enabled) {
    logger.info('jobs are not enabled');
    return;
  }

  const jobs: Array<Job> = [
    await import('../jobs/handlers/say_hello').then((r) => r.default),
  ];

  for (const job of jobs) {
    logger.info(`job '%s' configured to run at '%s'`, job.name, job.runAt);

    new Cron(job.runAt, async () => {
      await processJobs(jobs, job.name);
    });
  }

  await processJobs(jobs);
});

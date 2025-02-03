import { Cron } from 'croner';
import { type Job, processJobs } from '../jobs';

export default defineNitroPlugin(async () => {
  const jobs: Array<Job> = [
    await import('../jobs/handlers/say_hello').then((r) => r.default),
  ];

  for (const job of jobs) {
    if (typeof job.runAt === 'number') {
      setInterval(async () => {
        await processJobs(jobs, job.name);
        await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
      }, job.runAt * 1000);
    } else {
      new Cron(job.runAt, async () => {
        await processJobs(jobs, job.name);
      });
    }
  }

  await processJobs(jobs);
});

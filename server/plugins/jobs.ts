import { type Job, processJobs } from '../jobs';

export default defineNitroPlugin(async () => {
  const jobs: Array<Job> = [
    await import('../jobs/handlers/say_hello').then((r) => r.default),
  ];

  await processJobs(jobs);

  setInterval(async () => {
    await processJobs(jobs);
  }, 1000 * 60);
});

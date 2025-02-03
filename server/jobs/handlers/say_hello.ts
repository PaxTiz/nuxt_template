import { type DatabaseJob } from '~~/server/database';
import { defineJob } from '..';

export default defineJob({
  name: 'say_hello',

  runAt: 60,

  handler: async (job: DatabaseJob) => {
    console.log('Hello, World');
  },
});

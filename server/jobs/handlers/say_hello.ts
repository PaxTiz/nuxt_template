import { type DatabaseJob } from '~/server/database';
import { defineJob } from '..';

export default defineJob({
  name: 'say_hello',
  handler: async (job: DatabaseJob) => {
    console.log('Hello, World');
  },
});

import { z } from 'zod';
import { internal } from '~/server/lib/internal';

const schema = z.object({
  collection: z.enum(['users']),
});

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'DEVELOPER']);

  const { query } = await useValidation(event, {
    query: schema,
  });

  setHeader(event, 'Content-Type', 'text/csv');
  return internal.exporter[query.collection]();
});

import { internal } from '~~/server/lib/internal';
import { usersSchema } from '#shared/types';

export default defineEventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'DEVELOPER']);

  const { query } = await useValidation(event, {
    query: usersSchema.search,
  });

  return internal.users.search(query);
});

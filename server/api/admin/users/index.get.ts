import { internal } from '~/server/lib/internal';
import { adminUsers } from '~/types';

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'DEVELOPER']);

  const { query } = await useValidation(event, {
    query: adminUsers.search,
  });

  return internal.users.search(query);
});

import { internal } from '~/server/lib/internal';
import { adminUsers } from '~/types';

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'SUPER_ADMIN']);

  const { query } = await useValidation(event, {
    query: adminUsers.search,
  });

  return internal.users.search(query);
});

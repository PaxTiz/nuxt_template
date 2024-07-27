import { internal } from '~/server/lib/internal';
import { adminUsers } from '~/types';

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'SUPER_ADMIN']);

  const { params, body } = await useValidation(event, {
    params: adminUsers.findOne,
    body: adminUsers.update,
  });

  return internal.users.update(params.id, body);
});

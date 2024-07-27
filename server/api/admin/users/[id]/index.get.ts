import { internal } from '~/server/lib/internal';
import { adminUsers } from '~/types';

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'SUPER_ADMIN']);

  const { params } = await useValidation(event, {
    params: adminUsers.findOne,
  });

  const user = await internal.users.findById(params.id);
  if (!user) {
    throw createError({ statusCode: 404 });
  }

  return user;
});

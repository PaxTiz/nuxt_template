import { internal } from '~~/server/lib/internal';
import { usersSchema } from '#shared/types';

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'DEVELOPER']);

  const { params } = await useValidation(event, {
    params: usersSchema.findOne,
  });

  const user = await internal.users.findById(params.id);
  if (!user) {
    throw createError({ statusCode: 404 });
  }

  return user;
});

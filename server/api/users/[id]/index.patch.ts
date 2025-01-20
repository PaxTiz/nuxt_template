import { internal } from '~~/server/lib/internal';
import { usersSchema } from '#shared/types';

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'DEVELOPER']);

  const { params, body } = await useValidation(event, {
    params: usersSchema.findOne,
    body: usersSchema.update,
  });

  return internal.users.update(params.id, body);
});

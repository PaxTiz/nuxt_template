import { internal } from '~/server/lib/internal';
import { authSchema } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: authSchema.login,
  });

  await internal.auth.login(event, body);
});

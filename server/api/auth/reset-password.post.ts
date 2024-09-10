import { internal } from '~/server/lib/internal';
import { authSchema } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: authSchema.resetPassword,
  });

  await internal.auth.resetPassword(body);
});

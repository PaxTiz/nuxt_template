import { internal } from '~/server/lib/internal';
import { authSchema } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: authSchema.forgotPassword,
  });

  await internal.auth.forgotPassword(body);
});

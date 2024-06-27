import { internal } from '~/server/lib/internal';
import { resetPasswordSchema } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: resetPasswordSchema,
  });

  await internal.auth.resetPassword(body);
});

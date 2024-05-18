import { resetPassword } from '~/server/lib/internal/auth';
import { resetPasswordSchema } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: resetPasswordSchema,
  });

  await resetPassword(body);
});

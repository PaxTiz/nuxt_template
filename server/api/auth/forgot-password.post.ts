import { forgotPassword } from '~/server/lib/internal/auth';
import { forgotPasswordSchema } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: forgotPasswordSchema,
  });

  await forgotPassword(body);
});

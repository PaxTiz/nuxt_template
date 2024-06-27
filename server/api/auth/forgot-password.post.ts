import { internal } from '~/server/lib/internal';
import { forgotPasswordSchema } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: forgotPasswordSchema,
  });

  await internal.auth.forgotPassword(body);
});

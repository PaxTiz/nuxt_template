import { internal } from '~/server/lib/internal';
import { validateAccountSchema } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: validateAccountSchema,
  });

  await internal.auth.validateAccount(body);
});

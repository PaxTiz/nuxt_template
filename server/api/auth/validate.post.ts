import { validateAccount } from '~/server/lib/internal/auth';
import { validateAccountSchema } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: validateAccountSchema,
  });

  await validateAccount(body);
});

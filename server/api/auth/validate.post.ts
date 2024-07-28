import { internal } from '~/server/lib/internal';
import { auth } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: auth.validateAccount,
  });

  await internal.auth.validateAccount(body);
});

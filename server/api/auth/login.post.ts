import { internal } from '~/server/lib/internal';
import { loginSchema } from '~/types/users';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: loginSchema,
  });

  await internal.auth.login(event, body);
});

import { login } from '~/server/lib/internal/auth';
import { loginSchema } from '~/types/users';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: loginSchema,
  });

  await login(event, body);
});

import { register } from '~/server/lib/internal/auth';
import { registerSchema } from '~/types/users';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: registerSchema,
  });

  await register(body);

  setResponseStatus(event, 201);
});

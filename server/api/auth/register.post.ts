import { internal } from '~/server/lib/internal';
import { registerSchema } from '~/types/users';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: registerSchema,
  });

  await internal.auth.register(body);

  setResponseStatus(event, 201);
});

import { internal } from '~~/server/lib/internal';
import { authSchema } from '#shared/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: authSchema.register,
  });

  await internal.auth.register(body);

  setResponseStatus(event, 201);
});

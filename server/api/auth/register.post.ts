import { internal } from '~/server/lib/internal';
import { auth } from '~/types';

export default eventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: auth.register,
  });

  await internal.auth.register(body);

  setResponseStatus(event, 201);
});

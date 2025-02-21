import { internal } from '~~/server/lib/internal';
import { authSchema } from '#shared/types';

export default defineEventHandler(async (event) => {
  const { body } = await useValidation(event, {
    body: authSchema.forgotPassword,
  });

  await internal.auth.forgotPassword(body);
});

import { internal } from '~~/server/lib/internal';
import { dataImporterSchema } from '#shared/types';

export default defineEventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'DEVELOPER']);

  const { body } = await useValidation(event, {
    body: dataImporterSchema.importer,
  });

  return internal.importer[body.collection](body.items);
});

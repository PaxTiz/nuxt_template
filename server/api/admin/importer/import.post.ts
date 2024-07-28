import { internal } from '~/server/lib/internal';
import { adminImporter } from '~/types';

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'SUPER_ADMIN']);

  const { body } = await useValidation(event, {
    body: adminImporter.importer,
  });

  return internal.importer[body.collection](body.items);
});

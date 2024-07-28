import { internal } from '~/server/lib/internal';
import { adminImporter } from '~/types';
import { mimeTypes } from '~/utils/shared/files';

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'SUPER_ADMIN']);

  const { query, files } = await useValidation(event, {
    query: adminImporter.extract,
    files: {
      file: {
        required: true,
        mimeTypes: [mimeTypes.csv],
      },
    },
  });

  return internal.extracter[query.collection](files.file.data);
});

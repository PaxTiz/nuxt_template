import { internal } from '~/server/lib/internal';
import { dataImporterSchema } from '~/types';
import { mimeTypes } from '~/utils/shared/files';

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'DEVELOPER']);

  const { query, files } = await useValidation(event, {
    query: dataImporterSchema.extract,
    files: {
      file: {
        required: true,
        mimeTypes: [mimeTypes.csv],
      },
    },
  });

  return internal.extracter[query.collection](files.file.data);
});

import { z } from 'zod';
import { internal } from '~~/server/lib/internal';

const schema = z.object({
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  quality: z.coerce.number().optional(),
  blur: z.coerce.number().min(1).max(1000).optional(),
  format: z.enum(['png', 'jpeg', 'webp', 'avif']).optional(),
});

export default defineEventHandler(async (event) => {
  const { query } = await useValidation(event, {
    query: schema,
  });

  const path = event.context.params!.path!;
  const file = await internal.medias.download(path, {
    width: query.width,
    height: query.height,
    format: query.format,
    blur: query.blur,
    quality: query.quality,
  });

  if (!file) {
    throw createError({ statusCode: 404 });
  }

  return file;
});

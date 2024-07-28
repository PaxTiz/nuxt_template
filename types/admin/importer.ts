import { z } from 'zod';

const collections = z.enum(['demo']);

const demoItems = z.array(
  z.object({
    id: z.coerce.number(),
    name: z.string(),
  }),
);

export const adminImporter = {
  extract: z.object({
    collection: collections,
  }),

  importer: z.discriminatedUnion('collection', [
    z.object({
      collection: z.literal('demo'),
      items: demoItems,
    }),
  ]),
};

export type AdminImporter = {
  Collection: z.infer<typeof collections>;

  Demo: z.infer<typeof demoItems>;
};

import { z } from 'zod';
import { booleanSchema, paginationSchema } from '../shared';

export const adminUsers = {
  search: z
    .object({
      query: z.string().optional(),
      isEnabled: booleanSchema.optional(),
    })
    .merge(paginationSchema),
};

export type AdminUsers = {
  Search: z.infer<(typeof adminUsers)['search']>;
};

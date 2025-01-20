import { z } from 'zod';
import {
  booleanSchema,
  literalError,
  paginationSchema,
  requiredErrorMessage,
  userRoles,
} from '#shared/types';

export const usersSchema = {
  findOne: z.object({
    id: z.string().uuid(),
  }),

  search: z
    .object({
      query: z.string().optional(),
      isEnabled: booleanSchema.optional(),
    })
    .merge(paginationSchema),

  update: z.object({
    firstname: z.string({ required_error: requiredErrorMessage }),
    lastname: z.string({ required_error: requiredErrorMessage }),
    email: z
      .string({ required_error: requiredErrorMessage })
      .email('Veuillez entrer une adresse email valide'),
    address: z.object({
      line1: z.string(literalError),
      line2: z.string(literalError).nullish(),
      city: z.string(literalError),
      postalCode: z
        .string(literalError)
        .length(5, 'Le code postal doit être de 5 caractères')
        .regex(/(\d)+/, 'Le code postal ne peut être composé que de chiffres'),
    }),
    role: userRoles,
    isEnabled: booleanSchema,
  }),
};

export type Users = {
  Search: z.infer<(typeof usersSchema)['search']>;

  Update: z.infer<(typeof usersSchema)['update']>;
};

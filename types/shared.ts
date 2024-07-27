import { z } from 'zod';

export const requiredErrorMessage = 'Le champ est obligatoire';
export const literalError = {
  errorMap: () => ({
    message: requiredErrorMessage,
  }),
};

export const booleanSchema = z.union([
  z.literal('true').transform((_) => true),
  z.literal(true),
  z.literal('false').transform((_) => false),
  z.literal(false),
]);

export const constantsValidation = {
  PASSWORD_REGEX:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i,
};

export const paginationSchema = z.object({
  page: z.coerce.number().min(1),
  perPage: z.coerce.number().min(1),
});

export type Paginated<T> = {
  total: number;
  items: Array<T>;
};

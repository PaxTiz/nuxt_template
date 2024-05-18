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

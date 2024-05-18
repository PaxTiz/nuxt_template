import { z } from 'zod';
import {
  constantsValidation,
  literalError,
  requiredErrorMessage,
} from '~/types';

export const registerSchema = z.object({
  firstname: z.string({ required_error: requiredErrorMessage }),
  lastname: z.string({ required_error: requiredErrorMessage }),
  email: z
    .string({ required_error: requiredErrorMessage })
    .email('Veuillez entrer une adresse email valide'),
  password: z
    .string({ required_error: requiredErrorMessage })
    .regex(
      constantsValidation.PASSWORD_REGEX,
      'Le mot de passe doit contenir des caractères minuscules, majuscules, au moins 1 chiffre et un caractère spécial',
    ),
  address: z.object({
    line1: z.string(literalError),
    line2: z.string(literalError).nullish(),
    city: z.string(literalError),
    postalCode: z
      .string(literalError)
      .length(5, 'Le code postal doit être de 5 caractères')
      .regex(/(\d)+/, 'Le code postal ne peut être composé que de chiffres'),
  }),
});

export type Register = z.infer<typeof registerSchema>;

export const registerFormSchema = registerSchema
  .merge(
    z.object({
      passwordConfirmation: z
        .string({ required_error: requiredErrorMessage })
        .regex(
          constantsValidation.PASSWORD_REGEX,
          'Le mot de passe doit contenir des caractères minuscules, majuscules, au moins 1 chiffre et un caractère spécial',
        ),
    }),
  )
  .superRefine((values, { addIssue }) => {
    if (values.password !== values.passwordConfirmation) {
      addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Les mots de passes ne sont pas identiques',
        path: ['passwordConfirmation'],
      });
    }
  });

export const loginSchema = z.object({
  email: z
    .string({ required_error: requiredErrorMessage })
    .email('Veuillez entrer une adresse email valide'),
  password: z.string({ required_error: requiredErrorMessage }),
});

export type Login = z.infer<typeof loginSchema>;

export const validateAccountSchema = z.object({
  token: z.string().length(16),
  email: z
    .string(literalError)
    .email('Veuillez entrer une adresse email valide'),
});

export type ValidateAccount = z.infer<typeof validateAccountSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: requiredErrorMessage })
    .email('Veuillez entrer une adresse email valide'),
});

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().length(16),
    email: z
      .string({ required_error: requiredErrorMessage })
      .email('Veuillez entrer une adresse email valide'),
    password: z
      .string({ required_error: requiredErrorMessage })
      .regex(
        constantsValidation.PASSWORD_REGEX,
        'Le mot de passe doit contenir des caractères minuscules, majuscules, au moins 1 chiffre et un caractère spécial',
      ),
    passwordConfirmation: z
      .string({ required_error: requiredErrorMessage })
      .regex(
        constantsValidation.PASSWORD_REGEX,
        'Le mot de passe doit contenir des caractères minuscules, majuscules, au moins 1 chiffre et un caractère spécial',
      ),
  })
  .superRefine((values, { addIssue }) => {
    if (values.password !== values.passwordConfirmation) {
      addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Les mots de passes ne sont pas identiques',
        path: ['passwordConfirmation'],
      });
    }
  });

export type ResetPassword = z.infer<typeof resetPasswordSchema>;

import { hash, verify } from 'argon2';
import { and, eq } from 'drizzle-orm';
import { H3Event } from 'h3';
import useDatabase, { passwordResets, users } from '~/server/database';
import { randomString } from '~/server/utils/strings';
import type {
  ForgotPassword,
  Login,
  Register,
  ResetPassword,
  ValidateAccount,
} from '~/types';
import { sendEmail } from '../email';

const database = useDatabase();
const config = useRuntimeConfig();

export const login = async (event: H3Event, data: Login) => {
  const user = await database.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (!user) {
    throw createFormError({ key: 'email', message: 'invalid_credentials' });
  }

  const isPasswordValid = await verify(user.password, data.password);
  if (!isPasswordValid) {
    throw createFormError({ key: 'email', message: 'invalid_credentials' });
  }

  if (!user.isEnabled) {
    throw createFormError({ key: 'email', message: 'account_not_enabled' });
  }

  const { update } = await useAuthSession(event);
  await update(() => ({ userId: user.id }));
};

export const register = async (data: Register) => {
  const emailInUse = await database.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (emailInUse) {
    throw createFormError({ key: 'email', message: 'email_already_in_use' });
  }

  const validationCode = randomString();
  const passwordHash = await hash(data.password);
  await database.insert(users).values({
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    password: passwordHash,
    addressLine1: data.address.line1,
    addressLine2: data.address.line2,
    addressCity: data.address.city,
    addressPostalCode: data.address.postalCode,
    validationCode,
  });

  await sendEmail({
    template: 'register',
    subject: 'Bienvenue sur ' + config.public.applicationName,
    to: data.email,
    data: {
      applicationName: config.public.applicationName,
      fullname: `${data.firstname} ${data.lastname}`,
      url: `${config.public.webUrl}/auth/activation-compte?token=${validationCode}`,
    },
  });
};

export const validateAccount = async (data: ValidateAccount) => {
  const user = await database.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (!user) {
    throw createFormError({ key: 'email', message: 'email_not_found' });
  }
  if (user.validationCode !== data.token) {
    throw createFormError({ key: 'email', message: 'invalid_code' });
  }
  if (user.isEnabled) {
    throw createFormError({ key: 'email', message: 'account_already_active' });
  }

  await database
    .update(users)
    .set({ isEnabled: true, validationCode: null })
    .where(
      and(eq(users.email, data.email), eq(users.validationCode, data.token)),
    );
};

export const forgotPassword = async (data: ForgotPassword) => {
  const user = await database.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (!user) {
    return;
  }

  const token = randomString();
  await database.insert(passwordResets).values({
    userId: user.id,
    token,
  });

  await sendEmail({
    template: 'forgot_password',
    subject: 'Réinitialisation de votre mot de passe',
    to: user.email,
    data: {
      applicationName: config.public.applicationName,
      fullname: `${user.firstname} ${user.lastname}`,
      url: `${config.public.webUrl}/auth/reinitialisation-mot-de-passe?token=${token}`,
    },
  });
};

export const resetPassword = async (data: ResetPassword) => {
  const passwordReset = await database.query.passwordResets.findFirst({
    where: eq(passwordResets.token, data.token),
    with: { user: true },
  });

  if (!passwordReset) {
    throw createFormError({
      key: 'email',
      message: 'reset_password_token_not_found',
    });
  }

  if (passwordReset.user.email !== data.email) {
    throw createFormError({
      key: 'email',
      message: 'reset_password_invalid_email_for_token',
    });
  }

  const newHash = await hash(data.password);
  await database.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ password: newHash })
      .where(eq(users.id, passwordReset.user.id));

    await tx
      .delete(passwordResets)
      .where(eq(passwordResets.token, passwordReset.token));
  });

  await sendEmail({
    template: 'reset_password',
    subject: 'Votre mot de passe a été réinitialisé',
    to: passwordReset.user.email,
    data: {
      applicationName: config.public.applicationName,
      fullname: `${passwordReset.user.firstname} ${passwordReset.user.lastname}`,
      url: `${config.public.webUrl}/auth/connexion`,
    },
  });
};

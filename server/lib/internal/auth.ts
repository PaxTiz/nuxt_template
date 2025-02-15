import type { Auth } from '#shared/types';
import { hash, verify } from 'argon2';
import { and, eq } from 'drizzle-orm';
import { H3Event } from 'h3';
import { passwordResets, users } from '~~/server/database';
import { randomString } from '~~/server/utils/strings';
import { sendEmail } from '../email';
import { Service } from '../service';

export default class AuthService extends Service {
  async login(event: H3Event, data: Auth['Login']) {
    const user = await this.database.query.users.findFirst({
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

    await this.database
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const { password, validationCode, ...sessionUser } = user;
    await replaceUserSession(event, { user: sessionUser });
  }

  async register(data: Auth['Register']) {
    const emailInUse = await this.database.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (emailInUse) {
      throw createFormError({ key: 'email', message: 'email_already_in_use' });
    }

    const validationCode = randomString();
    const passwordHash = await hash(data.password);

    await Promise.all([
      this.database.insert(users).values({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: passwordHash,
        addressLine1: data.address.line1,
        addressLine2: data.address.line2,
        addressCity: data.address.city,
        addressPostalCode: data.address.postalCode,
        validationCode,
      }),
      sendEmail({
        template: 'register',
        subject: 'Bienvenue sur ' + this.config.public.applicationName,
        to: data.email,
        data: {
          fullname: `${data.firstname} ${data.lastname}`,
          url: `${this.config.public.webUrl}/auth/activation-compte?token=${validationCode}`,
        },
      }),
    ]);
  }

  async validateAccount(data: Auth['ValidateAccount']) {
    const user = await this.database.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!user) {
      throw createFormError({ key: 'email', message: 'email_not_found' });
    }
    if (user.validationCode !== data.token) {
      throw createFormError({ key: 'email', message: 'invalid_token' });
    }
    if (user.isEnabled) {
      throw createFormError({
        key: 'email',
        message: 'account_already_active',
      });
    }

    await this.database
      .update(users)
      .set({ isEnabled: true, validationCode: null })
      .where(
        and(eq(users.email, data.email), eq(users.validationCode, data.token)),
      );
  }

  async forgotPassword(data: Auth['ForgotPassword']) {
    const user = await this.database.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!user) {
      return;
    }

    const token = randomString();
    await Promise.all([
      this.database.insert(passwordResets).values({
        userId: user.id,
        token,
      }),
      sendEmail({
        template: 'forgot_password',
        subject: 'Réinitialisation de votre mot de passe',
        to: user.email,
        data: {
          fullname: `${user.firstname} ${user.lastname}`,
          url: `${this.config.public.webUrl}/auth/reinitialisation-mot-de-passe?token=${token}`,
        },
      }),
    ]);
  }

  async resetPassword(data: Auth['ResetPassword']) {
    const passwordReset = await this.database.query.passwordResets.findFirst({
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
    await Promise.all([
      this.database.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ password: newHash })
          .where(eq(users.id, passwordReset.user.id));

        await tx
          .delete(passwordResets)
          .where(eq(passwordResets.token, passwordReset.token));
      }),
      sendEmail({
        template: 'reset_password',
        subject: 'Votre mot de passe a été réinitialisé',
        to: passwordReset.user.email,
        data: {
          fullname: `${passwordReset.user.firstname} ${passwordReset.user.lastname}`,
          url: `${this.config.public.webUrl}/auth/connexion`,
        },
      }),
    ]);
  }
}

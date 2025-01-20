import { H3Event } from 'h3';
import type { User } from '~~/server/database';
import type { UserRole } from '#shared/types';

export const useUser = async (
  event: H3Event,
  allowedRoles?: Array<UserRole>,
): Promise<User> => {
  const session = await requireUserSession(event);
  const user = session.user;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw createError({ statusCode: 403, message: 'insufficient_role' });
  }

  return user;
};

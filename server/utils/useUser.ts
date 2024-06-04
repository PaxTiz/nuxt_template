import { H3Event } from 'h3';
import { type User } from '~/server/database';

export const useUser = async (event: H3Event): Promise<User> => {
  const session = await requireUserSession(event);
  return session.user;
};

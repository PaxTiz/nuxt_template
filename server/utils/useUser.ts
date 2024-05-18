import { eq } from 'drizzle-orm';
import { H3Event } from 'h3';
import useDatabase, { users, type User } from '~/server/database';
import { useAuthSession } from '~/server/utils/useAuthSession';

export const useUser = async (event: H3Event): Promise<User> => {
  const database = useDatabase();
  const { data } = await useAuthSession(event);

  const user = await database.query.users.findFirst({
    where: eq(users.id, data.userId),
    columns: { password: false },
  });

  if (!user) {
    throw createError({ statusCode: 401 });
  }

  return user;
};

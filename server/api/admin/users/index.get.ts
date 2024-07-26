import { useDatabase } from '~/server/database';

export default eventHandler(async (event) => {
  await useUser(event, ['ADMIN', 'SUPER_ADMIN']);

  const database = useDatabase();
  return database.query.users.findMany();
});

import useDatabase, { migrate } from '../database';

export default eventHandler(async () => {
  const database = useDatabase();
  await migrate(database);
});

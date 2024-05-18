import { H3Event } from 'h3';

export const useAuthSession = async (event: H3Event) => {
  const config = useRuntimeConfig();
  const { data, update, clear } = await useSession<{ userId: string }>(event, {
    name: 'user',
    password: config.secrets.session,
    maxAge: 3600 * 4, // 4 hours,
  });

  return {
    data,
    update,
    clear,
  };
};

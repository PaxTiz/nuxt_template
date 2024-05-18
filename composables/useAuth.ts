import type { User } from '~/server/database';

export const useAuth = () => {
  const _user = useState<User | null>('user', () => null);
  const isAuth = computed(() => _user.value !== null);
  const user = computed(() => _user.value!);

  const refresh = async () => {
    const { data, error } = await useFetch<User>('/api/auth/me');
    if (error.value) {
      return showError(createError({ statusCode: 401, fatal: true }));
    } else {
      _user.value = data.value!;
    }
  };

  return {
    user,
    isAuth,

    refresh,
  };
};

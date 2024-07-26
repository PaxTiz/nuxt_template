export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();

  if (!['ADMIN', 'SUPER_ADMIN'].includes(user.value?.role ?? '')) {
    throw createError({ statusCode: 403 });
  }
});

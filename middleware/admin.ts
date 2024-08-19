export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();

  if (!['ADMIN', 'DEVELOPER'].includes(user.value?.role ?? '')) {
    throw createError({ statusCode: 403 });
  }
});

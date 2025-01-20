export default defineNuxtRouteMiddleware(async ({ path }) => {
  if (path.startsWith('/auth')) {
    return;
  }

  const { fetch, loggedIn } = useUserSession();
  if (!loggedIn.value) {
    await fetch();
  }

  if (!loggedIn.value) {
    throw createError({ statusCode: 401 });
  }
});

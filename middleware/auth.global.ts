export default defineNuxtRouteMiddleware(async ({ path }) => {
  if (path.startsWith('/auth')) {
    return;
  }

  const { refresh } = useAuth();
  await refresh();
});

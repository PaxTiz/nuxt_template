export const useMiamMiam = () => {
  const { initialize } = useGtag();

  const areCookiesEnabled = useCookie('are_cookies_enabled', {
    maxAge: 31_536_000, // 1 year
    sameSite: 'strict',
    decode(value) {
      return value ? value === 'true' : null;
    },
  });

  watch(
    areCookiesEnabled,
    (ok) => {
      if (!ok) {
        return;
      }

      initialize();
    },
    { immediate: true },
  );

  return {
    areCookiesEnabled,
  };
};

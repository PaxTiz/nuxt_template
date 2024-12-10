import type { UseFetchOptions } from '#app';
import { defu } from 'defu';
import { formatFormErrors, handleFetchErrors } from '~/utils/errors/errors';

export const useCustomFetch = async <T>(
  url: string | (() => string),
  options: UseFetchOptions<T> & { errorKey?: string } = {},
) => {
  const errorKey = options.errorKey ?? `${url}_${new Date().toLocaleString()}`;
  const { setErrors, reset } = useFormErrors(errorKey);

  const defaults: UseFetchOptions<T> = {};
  const params = defu(options, defaults);
  const { data, error, status, refresh, clear } = await useFetch(url, params);

  if (error.value && error.value.statusCode === 422) {
    setErrors(formatFormErrors(error.value));
  }

  handleFetchErrors(error);

  const refreshWrapper = () => {
    reset();
    return refresh();
  };

  const clearWrapper = () => {
    reset();
    return clear();
  };

  return {
    data,
    error,
    pending: computed(() => status.value === 'pending'),
    refresh: refreshWrapper,
    clear: clearWrapper,
  };
};

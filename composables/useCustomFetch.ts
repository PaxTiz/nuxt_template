import type { UseFetchOptions } from '#app';
import { defu } from 'defu';
import { formatFormErrors, handleFetchErrors } from '~/utils/errors/errors';

export const useCustomFetch = async <T>(
  url: string,
  options: UseFetchOptions<T> = {},
) => {
  const defaults: UseFetchOptions<T> = {
    key: url,
    watch: false,
  };

  const params = defu(options, defaults);
  const { data, error, pending, refresh } = await useFetch(url, params);
  handleFetchErrors(error);

  return {
    data: computed(() => data.value!),
    error: formatFormErrors(error),
    pending,
    refresh,
  };
};

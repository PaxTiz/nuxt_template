import type { UseFetchOptions } from '#app';
import { useFormErrors } from '~/composables/useFormErrors';
import { formatFormErrors } from '~/utils/errors/errors';

export const useCustomFetch = async <T>(
  url: string | (() => string),
  options?: UseFetchOptions<T> & { errorKey?: string },
) => {
  const { setErrors } = useFormErrors(options?.errorKey);
  const response = await useFetch(url, {
    ...options,
    onRequest() {
      setErrors([]);
    },
  });

  if (response.error.value) {
    if (response.error.value.statusCode === 422) {
      setErrors(formatFormErrors(response.error));
    } else {
      throw createError({
        status: response.error.value.status,
        fatal: true,
      });
    }
  }

  return response;
};

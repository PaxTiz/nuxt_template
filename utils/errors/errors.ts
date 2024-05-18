import type { FetchError } from 'ofetch';
import type { MaybeRef } from 'vue';

export type FormError = { key: string; message: string };

export const handleFetchErrors = (error: MaybeRef<FetchError | null>) => {
  const e = unref(error);
  if (!e) {
    return;
  }

  if (e.statusCode === 401) {
    console.log('not authenticated');
    throw createError({ statusCode: 401, fatal: true });
  }

  if (e.statusCode === 403) {
    throw createError({ statusCode: 403, fatal: true });
  }

  if (e.statusCode === 404) {
    throw createError({ statusCode: 404, fatal: true });
  }

  if (e.statusCode === 422) {
    return;
  }

  throw createError({ statusCode: 500, fatal: true });
};

export const formatFormErrors = (errors: MaybeRef<FetchError | null>) => {
  const e = unref(errors);
  if (!e) {
    return;
  }

  return e.data.data as Array<FormError>;
};

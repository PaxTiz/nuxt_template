import type { FetchError } from 'ofetch';
import type { MaybeRef } from 'vue';

export type FormError = { key: string; message: string };

export const formatFormErrors = (
  errors: MaybeRef<FetchError | null | undefined>,
) => {
  const e = unref(errors);
  if (!e) {
    return;
  }

  return e.data.data as Array<FormError>;
};

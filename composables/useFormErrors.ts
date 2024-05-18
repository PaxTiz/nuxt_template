import type { FormError } from '~/utils/errors/errors';
import { cleanErrors } from '~/utils/errors/messages';

export const useFormErrors = (key: string) => {
  const errors = useState<Array<FormError>>(key, () => []);

  const setErrors = (e: Array<FormError> | undefined) => {
    errors.value = (e ?? []).map((e) => ({
      key: e.key,
      message: cleanErrors(e.message),
    }));
  };

  return {
    errors: readonly(errors),
    setErrors,
  };
};

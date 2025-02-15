import type { FormError } from '~/utils/errors/errors';
import { cleanErrors } from '~/utils/errors/messages';

export const useFormErrors = (key?: string) => {
  const realKey = key ?? `form_errors:${useId()}`;
  const errors = useState<Array<FormError>>(realKey, () => []);

  const setErrors = (e: Array<FormError> | undefined) => {
    errors.value = (e ?? []).map((e) => ({
      key: e.key,
      message: cleanErrors(e.message),
    }));
  };

  const reset = () => {
    errors.value = [];
  };

  return {
    key: realKey,
    errors: readonly(errors),
    setErrors,
    reset,
  };
};

import { formatDate, setDefaultOptions } from 'date-fns';
import { fr } from 'date-fns/locale';

setDefaultOptions({ locale: fr });

export const useFormatter = () => ({
  formatDate,
});

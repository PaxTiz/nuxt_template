import { DateTime, Settings } from 'luxon';

export const useFormatter = () => {
  Settings.defaultLocale = 'fr';

  return {
    formatDatetime: (date: Date | string) => {
      const d =
        typeof date === 'string'
          ? DateTime.fromISO(date)
          : DateTime.fromJSDate(date);

      return d.toLocaleString(DateTime.DATETIME_SHORT);
    },
  };
};

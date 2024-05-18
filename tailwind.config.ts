import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  plugins: [typography],

  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
      },
    },
  },

  corePlugins: {
    preflight: false,
  },
};

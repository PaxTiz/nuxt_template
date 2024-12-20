import fr from './utils/primevue/locale.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-07',

  devtools: { enabled: true },

  typescript: {
    strict: true,

    // TODO: Enable back type checking (https://github.com/atinux/nuxt-auth-utils/issues/191)
    typeCheck: false,
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  app: {
    head: {
      titleTemplate: '%s - ' + process.env.NUXT_PUBLIC_APPLICATION_NAME,
    },
  },

  runtimeConfig: {
    public: {
      environment: process.env.NUXT_PUBLIC_ENVIRONMENT,
      cookieDomain: process.env.NUXT_PUBLIC_COOKIE_DOMAIN,
      webUrl: process.env.NUXT_PUBLIC_WEB_URL,
      applicationName: process.env.NUXT_PUBLIC_APPLICATION_NAME,
    },

    session: {
      name: 'user',
      password: process.env.NUXT_SESSION_PASSWORD!,
      maxAge: 60 * 60 * 24, // 24 hours
    },

    database: {
      logs: process.env.NUXT_DATABASE_LOGS === 'true',
      host: process.env.NUXT_DATABASE_HOST,
      port: Number(process.env.NUXT_DATABASE_PORT),
      user: process.env.NUXT_DATABASE_USER,
      password: process.env.NUXT_DATABASE_PASS,
      name: process.env.NUXT_DATABASE_NAME,
    },

    email: {
      enabled: process.env.NUXT_EMAIL_ENABLED === 'true',
      host: process.env.NUXT_EMAIL_SMTP_HOST,
      port: Number(process.env.NUXT_EMAIL_SMTP_PORT),
      username: process.env.NUXT_EMAIL_SMTP_USER,
      password: process.env.NUXT_EMAIL_SMTP_PASS,
      secure: process.env.NUXT_EMAIL_SMTP_SECURE === 'true',
      defaultFrom: process.env.NUXT_EMAIL_DEFAULT_FROM,
    },
  },

  css: ['./assets/scss/app.scss'],

  modules: [
    'nuxt-auth-utils',
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-gtag',
    '@nuxt/icon',
  ],

  gtag: {
    enabled: false,
    id: 'ABCD',
  },

  primevue: {
    options: { locale: { ...fr } },
    importTheme: { from: '~/utils/primevue/theme.ts' },
    components: {
      include: [
        'Divider',
        'Card',
        'Button',
        'InputText',
        'Select',
        'SelectButton',
        'FileUpload',
        'Message',
        'Toast',
        'Tag',
        'ProgressBar',
        'Dialog',
        'DynamicDialog',
        'DataTable',
        'Column',
        'Row',
      ],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // TODO: Remove this when Nuxt will use modern API by default
          api: 'modern',
        },
      },
    },
  },
});

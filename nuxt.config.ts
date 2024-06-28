import fr from './utils/primevue/locale.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: true,
  },

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

  css: [
    './assets/scss/app.scss',
    'primevue/resources/themes/aura-light-blue/theme.css',
  ],

  modules: [
    'nuxt-auth-utils',
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@vueuse/nuxt',
    'nuxt-primevue',
    'nuxt-gtag',
  ],

  gtag: {
    enabled: false,
    id: 'ABCD',
  },

  primevue: {
    options: { locale: { ...fr } },
    components: {
      include: ['Divider', 'Button', 'InputText', 'Message', 'Toast'],
    },
  },
});

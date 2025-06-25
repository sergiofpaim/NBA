export default {
  plugins: [
    '~/plugins/api.ts'
  ],
  modules: ['@pinia/nuxt'],

  env: {
    NUXT_ENV_API_PORT: process.env.NUXT_ENV_API_PORT || 8080
  },

  compatibilityDate: '2025-02-27'
};
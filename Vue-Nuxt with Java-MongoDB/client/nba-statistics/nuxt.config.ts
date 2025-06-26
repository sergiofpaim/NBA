import vuetifyPlugin from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/globalTheme.css'],
  modules: ['@pinia/nuxt'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
      global: true
    },
  ],

  build: {
    transpile: ['vuetify'],
  },
  vite: {
    plugins: [
      vuetifyPlugin()
    ]
  }
})
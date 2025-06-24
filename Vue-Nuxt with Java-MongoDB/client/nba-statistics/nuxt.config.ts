import vuetifyPlugin from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/globalTheme.css'],
  modules: ['@pinia/nuxt'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    plugins: [
      vuetifyPlugin()
    ]
  }
})
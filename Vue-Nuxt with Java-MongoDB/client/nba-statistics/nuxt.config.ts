import vuetifyPlugin from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: [
    '~/assets/css/globalTheme.css',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  modules: [
    '@pinia/nuxt',
    'nuxt-vuetify'
  ],

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
  },

  vuetify: {
    moduleOptions: {
      styles: { configFile: '~/assets/css/settings.scss' }
    },
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi',
        sets: {
          mdi: {
            component: 'VIcon'
          }
        }
      }
    }
  }
})
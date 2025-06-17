// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// your MUI-like theme translated to Vuetify
const theme = {
    defaultTheme: 'light',
    themes: {
        light: {
            colors: {
                primary: '#ffffff',
                secondary: '#DA1A32',
                background: '#00438C',
                'text-primary': '#ffffff',
                'text-secondary': '#00438C',
                overlay: 'rgba(255,255,255,0.1)',
            },
        },
    },
    typography: {
        fontFamily: '"Geomanist","Helvetica","Arial",sans-serif',
    },
}

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components,
        directives,
        theme,
    })
    nuxtApp.vueApp.use(vuetify)
})

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Is This Map Safe?',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'A validator for Call of Duty: Black Ops III workshop items which analyzes for malicious code.',
      },
      { name: 'format-detection', content: 'telephone=no' },

      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://isthismapsafe.xyz/' },
      { property: 'og:title', content: 'Is This Map Safe?' },
      {
        property: 'og:description',
        content:
          'A validator for Call of Duty: Black Ops III workshop items which analyzes for malicious code.',
      },
      { property: 'og:image', content: 'https://isthismapsafe.xyz/logo.png' },

      { property: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@JariKCoding' },
      { property: 'og:site_name', content: 'Is This Map Safe?' },
      { name: 'twitter:image:alt', content: 'Logo of Is This Map Safe?' },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/scss/argon.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~plugins/vue-infinite-scroll.js', ssr: false }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/fontawesome',
  ],

  fontawesome: {
    icons: {
      solid: ['faSearch', 'faHome', 'faEnvelope', 'faQuestion'],
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      scss: {
        sassOptions: {
          quietDeps: true,
        },
      },
    },
  },
}

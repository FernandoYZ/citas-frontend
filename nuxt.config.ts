// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-11-01",
  devServer: {
    host: 'localhost',
    port: 3000,
  },
  devtools: { enabled: false },
  css: ['~/assets/css/main.css',],
  plugins: [
    '~/plugins/auth.js',
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3055/api'
    }
  },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "@pinia/nuxt",
  ],
  imports: {
    dirs: ['~/composables'],
  },

  app: {
    head: {
      title: "SIHCE - Sistema Integrado Hospitalario",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Sistema Integrado Hospitalario para gestión de pacientes y atenciones médicas.",
        },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' },
        { rel: 'icon', type: 'image/webp', href: '/logo.webp' }
      ],
    },
  },
});

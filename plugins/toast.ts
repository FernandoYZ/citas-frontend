// Simple toast plugin para Nuxt usando UI
export default defineNuxtPlugin({
  name: "toast-plugin",
  setup(nuxtApp) {
    // Función centralizada para mostrar notificaciones
    const toast = {
      success: (message: string) => {
        useNuxtApp().$ui.notification.add({
          title: "Éxito",
          text: message,
          color: "green",
        });
      },
      error: (message: string) => {
        useNuxtApp().$ui.notification.add({
          title: "Error",
          text: message,
          color: "red",
        });
      },
      warning: (message: string) => {
        useNuxtApp().$ui.notification.add({
          title: "Advertencia",
          text: message,
          color: "yellow",
        });
      },
      info: (message: string) => {
        useNuxtApp().$ui.notification.add({
          title: "Información",
          text: message,
          color: "blue",
        });
      },
    };

    nuxtApp.provide("toast", toast);
  },
});

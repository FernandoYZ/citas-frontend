// plugins/exportPlugin.js
import { exportData } from "~/utils/exportService";

export default defineNuxtPlugin((nuxtApp) => {
  // Registramos el servicio de exportación como $export
  nuxtApp.provide("export", exportData);
});

// Tipo para TypeScript (opcional)
// Si estás usando TypeScript, puedes definir el tipo así:
/*
declare module '#app' {
  interface NuxtApp {
    $export: typeof exportData;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $export: typeof exportData;
  }
}
*/

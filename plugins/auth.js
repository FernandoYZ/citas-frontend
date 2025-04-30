import { useAuth } from '~/composables/useAuth';

export default defineNuxtPlugin(async (nuxtApp) => { //'nuxtApp' is declared but its value is never read.
  if (import.meta.client) {
    const { authModel } = useAuth();
    if (authModel && authModel.user) { // Verificar authModel y authModel.user
      if (localStorage.getItem('token')) {
        authModel.user.isAuthenticated = true;
      }
    } else {
      console.warn('authModel o authModel.user no está definido en auth.js');
    }
  }
});
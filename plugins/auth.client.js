// plugins/auth.client.js
import { useAuthModel } from '../models/useAuthModel';

export default defineNuxtPlugin(() => {
  // Usamos directamente el modelo de autenticación
  const authModel = useAuthModel();
  
  // Verificar si hay un token en localStorage y actualizar el estado
  if (localStorage.getItem('token')) {
    console.log('Plugin auth - Token encontrado, estableciendo autenticación');
    authModel.user.isAuthenticated = true;
  } else {
    console.log('Plugin auth - No se encontró token');
  }
});
// middleware/auth.global.ts
import { useAuthModel } from '~/models/useAuthModel';

export default defineNuxtRouteMiddleware((to) => {
  // En el servidor, no podemos acceder a localStorage, así que pasamos
  if (process.server) {
    return;
  }

  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(to.path);
  
  // Verificar si hay token en localStorage
  const token = localStorage.getItem('token');
  
  console.log('Middleware auth - Ruta:', to.path);
  console.log('Middleware auth - Token existe:', !!token);
  console.log('Middleware auth - Es ruta pública:', isPublicRoute);

  // Si no hay token y la ruta no es pública, redirigir a login
  if (!token && !isPublicRoute) {
    console.log('No hay token y no es ruta pública - Redirigiendo a login');
    return navigateTo('/login');
  }

  // Si hay token y la ruta es login, redirigir a citas (el usuario ya está autenticado)
  if (token && isPublicRoute) {
    console.log('Usuario ya autenticado, redirigiendo desde auth.global.ts');
    return navigateTo('/citas');
  }
});
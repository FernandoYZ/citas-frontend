// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  console.log("=== Middleware auth - Inicio ===");
  if (import.meta.server) {
    console.log("=== Middleware auth - Servidor, saliendo ===");
    return;
  }
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(to.path);
  const token = localStorage.getItem('token');
  console.log('Middleware auth - Ruta:', to.path);
  console.log('Middleware auth - Token existe:', !!token);
  console.log('Middleware auth - Es ruta pública:', isPublicRoute);
  if (!token && !isPublicRoute) {
    console.log('Middleware auth - No hay token y no es ruta pública - Redirigiendo a login');
    return navigateTo('/login');
  }
  if (token && isPublicRoute) {
    console.log('Middleware auth - Usuario ya autenticado, redirigiendo desde auth.global.ts');
    return navigateTo('/citas');
  }
  console.log("=== Middleware auth - Fin ===");
});
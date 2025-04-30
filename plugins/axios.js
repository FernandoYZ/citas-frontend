// plugins/axios.js
import axios from 'axios';

export default defineNuxtPlugin(() => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3055/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Interceptor para añadir el token a las peticiones
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar respuestas
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        // Redirigir a login si es necesario
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: axiosInstance
    }
  };
});
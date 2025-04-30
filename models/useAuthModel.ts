// models/useAuthModel.ts
import { ref, reactive } from 'vue';
import { apiService } from '~/services/ApiService';

interface User {
  isAuthenticated: boolean;
  id: number | null;
  nombre: string;
  apellido: string;
}

interface LoginResponse {
  mensaje: string;
  token: string;
  nombre: string;
  apellido: string;
}

interface VerifyTokenResponse {
  valid: boolean;
  usuario?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  mensaje?: string;
}

export function useAuthModel() {
  // Estado de usuario con estructura reactiva
  const user = reactive<User>({
    isAuthenticated: false,
    id: null,
    nombre: '',
    apellido: ''
  });
  
  const isLoading = ref(false);
  const error = ref('');

  // Función para verificar si hay un token en localStorage
  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    try {
      // Verificar validez del token con el backend
      const { data, error: apiError } = await apiService.get<VerifyTokenResponse>('/api/login/verify-token');
      
      if (apiError || !data || !data.valid) {
        console.error('Token inválido:', apiError || (data?.mensaje || 'Razón desconocida'));
        localStorage.removeItem('token');
        user.isAuthenticated = false;
        return false;
      }
      
      // Token válido, actualizar estado de usuario
      if (data.usuario) {
        user.isAuthenticated = true;
        user.id = data.usuario.id;
        user.nombre = data.usuario.nombre;
        user.apellido = data.usuario.apellido;
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error al verificar token:', err);
      localStorage.removeItem('token');
      user.isAuthenticated = false;
      return false;
    }
  };

  // Función de login con conexión real al backend
  const login = async (usuario: string, contraseña: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = '';
    
    try {
      // Llamada real a la API de login
      const { data, error: apiError, status } = await apiService.post<LoginResponse>(
        '/api/login/login', 
        { usuario, contraseña }
      );
      
      if (apiError || !data) {
        error.value = apiError || 'Error al iniciar sesión';
        console.error('Error en login:', error.value, status);
        return false;
      }
      
      // Guardar token y actualizar estado
      localStorage.setItem('token', data.token);
      user.isAuthenticated = true;
      user.nombre = data.nombre;
      user.apellido = data.apellido;
      
      // Obtenemos el ID del usuario haciendo una verificación del token
      await checkAuth();
      
      console.log('Login exitoso:', data.mensaje);
      return true;
    } catch (err) {
      console.error('Error en conexión con servidor:', err);
      error.value = err instanceof Error ? err.message : 'Error al conectar con el servidor';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Función de logout
  const logout = (): void => {
    localStorage.removeItem('token');
    user.isAuthenticated = false;
    user.id = null;
    user.nombre = '';
    user.apellido = '';
  };

  // Inicializar el estado si estamos en el cliente
  if (import.meta.client) {
    // Realizar verificación inicial del token
    checkAuth();
  }

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    checkAuth
  };
}
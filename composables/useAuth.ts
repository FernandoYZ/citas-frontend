// composables/useAuth.ts
import { ref, reactive, computed } from 'vue';
import { useAuthModel } from '../models/useAuthModel';
import { useRouter } from 'vue-router';

interface Credentials {
  usuario: string;
  contraseña: string;
}

interface UserData {
  id: number | null;
  nombre: string;
  apellido: string;
}

export function useAuth() {
  const authModel = useAuthModel();
  const router = useRouter();

  const credentials = reactive<Credentials>({
    usuario: '',
    contraseña: '',
  });
  
  const isLoading = ref(false);
  const error = ref('');

  // Computar el estado de autenticación basado en el estado del modelo
  const isAuthenticated = computed(() => authModel.user.isAuthenticated);
  const userData = computed<UserData>(() => ({
    id: authModel.user.id,
    nombre: authModel.user.nombre,
    apellido: authModel.user.apellido
  }));

  const login = async (): Promise<boolean> => {
    console.log("useAuth.ts - login() called");
    isLoading.value = true;
    error.value = '';
    
    try {
      // Usar la función de login del modelo de autenticación
      const success = await authModel.login(credentials.usuario, credentials.contraseña);
      console.log("useAuth.ts - login() success:", success);
      
      if (success) {
        console.log("useAuth.ts - login() redirecting to /citas");
        router.push('/citas');
      } else {
        console.error('Error para iniciar sesión');
        error.value = authModel.error.value || 'Credenciales inválidas';
      }
      return success;
    } catch (err) {
      console.error('Error en el proceso de login:', err);
      error.value = err instanceof Error ? err.message : 'Error en el servidor';
      return false;
    } finally {
      isLoading.value = authModel.isLoading.value;
    }
  };

  const logout = (): void => {
    authModel.logout();
    router.push('/login');
  };

  // Verificar token al inicio
  const verifyAuth = async (): Promise<boolean> => {
    if (!import.meta.env.SSR) {
      const valid = await authModel.checkAuth();
      if (!valid) {
        logout(); 
      }
      return valid;
    }
    return false;
  };

  return {
    credentials,
    isLoading,
    error,
    isAuthenticated,
    userData,
    login,
    logout,
    verifyAuth,
    authModel
  };
}
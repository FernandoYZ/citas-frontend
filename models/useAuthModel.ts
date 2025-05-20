// models/useAuthModel.ts
import { ref, reactive } from "vue";
import { apiService } from "~/services/ApiService";

interface User {
  isAuthenticated: boolean;
  id: number | null;
  idMedico: number | null;
  nombre: string;
  apellido: string;
  isMedico: boolean;
  roles: Role[];
  permisos: Permission[];
  acciones: Action[];
  especialidades: Especialidad[];
}

interface Action {
  idItem: number;
  agregar: boolean;
  modificar: boolean;
  eliminar: boolean;
  consultar: boolean;
}

interface Role {
  id: number;
  nombre: string;
}

interface Permission {
  id: number;
  descripcion: string;
  modulo: string;
}

interface Especialidad {
  id: number;
  nombre: string;
}

interface LoginResponse {
  mensaje: string;
  token: string;
  nombre: string;
  apellido: string;
  isMedico: boolean;
  idMedico: number | null;
  roles: Role[];
  permisos: Permission[];
  acciones: Action[];
  especialidades: Especialidad[];
}

interface VerifyTokenResponse {
  valid: boolean;
  usuario?: {
    id: number;
    nombre: string;
    apellido: string;
    isMedico: boolean;
  };
  mensaje?: string;
}

export function useAuthModel() {
  // Estado de usuario con estructura reactiva
  const user = reactive<User>({
    isAuthenticated: false,
    id: null,
    idMedico: null,
    nombre: "",
    apellido: "",
    isMedico: false,
    roles: [],
    permisos: [],
    acciones: [],
    especialidades: [],
  });

  const isLoading = ref(false);
  const error = ref("");

  // Función para verificar si hay un token en localStorage
  const checkAuth = async (): Promise<boolean> => {
    console.log("=== Inicio de checkAuth ===");
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("=== checkAuth: No hay token ===");
      return false;
    }
    try {
      const { data, error: apiError } = await apiService.get<VerifyTokenResponse>("/api/login/verify-token");
      if (apiError || !data || !data.valid) {
        console.error("Token inválido:", apiError || data?.mensaje || "Razón desconocida");
        localStorage.removeItem("token");
        user.isAuthenticated = false;
        console.log("=== checkAuth: Token inválido ===");
        return false;
      }
      if (data.usuario) {
        user.isAuthenticated = true;
        user.id = data.usuario.id;
        user.nombre = data.usuario.nombre;
        user.apellido = data.usuario.apellido;
        user.isMedico = data.usuario.isMedico;
        console.log("=== checkAuth: Token válido, usuario autenticado ===");
        return true;
      }
      console.log("=== Fin de checkAuth: Token no válido ===");
      return false;
    } catch (err) {
      console.error("Error al verificar token:", err);
      localStorage.removeItem("token");
      user.isAuthenticated = false;
      console.log("=== Fin de checkAuth: Error ===");
      return false;
    }
  };

  // Función de login con conexión real al backend
  const login = async (
    usuario: string,
    contraseña: string
  ): Promise<boolean> => {
    isLoading.value = true;
    error.value = "";

    try {
      // Llamada real a la API de login
      const {
        data,
        error: apiError,
        status,
      } = await apiService.post<LoginResponse>("/api/login/login", {
        usuario,
        contraseña,
      });

      if (apiError || !data) {
        error.value = apiError || "Error al iniciar sesión";
        console.error("Error en login:", error.value, status);
        return false;
      }

      // Guardar token y actualizar estado
      localStorage.setItem("token", data.token);
      user.isAuthenticated = true;
      user.id = data.id || null;
      user.idMedico = data.idMedico || null;
      user.nombre = data.nombre;
      user.apellido = data.apellido;
      user.isMedico = data.isMedico;
      user.roles = data.roles || [];
      user.permisos = data.permisos || [];
      user.acciones = data.acciones || [];
      user.especialidades = data.especialidades || [];

      // IMPORTANTE: Llamar a recalcularPermisosDesdeToken justo después de almacenar el token
      // Importa la función aquí para evitar dependencias circulares
      const { recalcularPermisos } = usePermissions();
      recalcularPermisos();

      // Obtenemos el ID del usuario haciendo una verificación del token
      await checkAuth();

      console.log("Login exitoso:", data.mensaje);
      return true;
    } catch (err) {
      console.error("Error en conexión con servidor:", err);
      error.value =
        err instanceof Error
          ? err.message
          : "Error al conectar con el servidor";
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Función de logout
  const logout = (): void => {
    localStorage.removeItem("token");
    user.isAuthenticated = false;
    user.id = null;
    user.nombre = "";
    user.apellido = "";
    user.isMedico = false;
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
    checkAuth,
    // Métodos para verificar roles
    hasRole: (roleId: number) => user.roles.some((r) => r.id === roleId),
    hasAnyRole: (roleIds: number[]) =>
      roleIds.some((id) => user.roles.some((r) => r.id === id)),

    // Métodos para verificar permisos
    hasPermission: (permissionId: number) =>
      user.permisos.some((p) => p.id === permissionId),
    hasAnyPermission: (permissionIds: number[]) =>
      permissionIds.some((id) => user.permisos.some((p) => p.id === id)),

    // Método para verificar acciones específicas
    canPerformAction: (
      itemId: number,
      action: "agregar" | "modificar" | "eliminar" | "consultar"
    ) => {
      // Si es administrador, siempre permitir
      if (user.roles.some((r) => r.id === 1)) return true;

      // Buscar la acción específica
      return user.acciones.some((a) => {
        if (a.idItem !== itemId) return false;

        switch (action) {
          case "agregar":
            return a.agregar;
          case "modificar":
            return a.modificar;
          case "eliminar":
            return a.eliminar;
          case "consultar":
            return a.consultar;
          default:
            return false;
        }
      });
    },
  };
}

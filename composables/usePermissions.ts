import { ref } from "vue";

// Constantes para IDs comunes
const ROLES = {
  ADMIN: 1,
  RECEPCION: 52,
  ARCHIVO: 62,
  ENFERMERIA: 101,
  MEDICO_CE: 149,
  PROGRAMAS: 154,
  TRIAJE: 170,
};

const ITEMS = {
  PACIENTE: 101,
  CITAS: 102,
  ATENCION_MEDICA: 103,
  TRIAJE: 1303,
  HISTORIA_CLINICA: 501,
  RECETAS: 1366,
};

const PERMISOS = {
  VER_PACIENTE: 359,
  VER_CITA: 360,
  VER_ALTA: 361,
  REGISTRAR_CITAS: 365,
  REGISTRAR_CITAS_REPETIDAS: 365,
  IMPRIMIR_BOLETA: 367,
  IMPRIMIR_HISTORICO: 407,
};

// Variables reactivas para los estados de permisos
const isAdmin = ref(false);
const isRecepcion = ref(false);
const isMedico = ref(false);
const isArchivoClinico = ref(false);
const isTriaje = ref(false);
const isProgramas = ref(false);

const canRegisterAppointments = ref(false);
const canPerformTriage = ref(false);
const canRegisterMedicalAttention = ref(false);
const canViewAllAppointments = ref(false);
const canViewAllPatients = ref(false);
const canViewOnlyOwnAppointments = ref(false);
const canPrintDocuments = ref(false);

// Función para recalcular permisos directamente desde el token
function recalcularPermisosDesdeToken() {
  console.log("Recalculando permisos desde el token JWT");

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No hay token en localStorage");
    // Restablecer todos los permisos a false cuando no hay token
    resetAllPermissions();
    return false;
  }

  try {
    // Decodificar el token JWT manualmente
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    console.log("Payload del token:", {
      roles: payload.roles,
      permisos: payload.permisos?.length || 0,
      acciones: payload.accionesItems?.length || 0,
    });

    // Verificar roles específicos
    isAdmin.value = Array.isArray(payload.roles) && payload.roles.includes(ROLES.ADMIN);
    isRecepcion.value = Array.isArray(payload.roles) && payload.roles.includes(ROLES.RECEPCION);
    isMedico.value = !!payload.isMedico || 
                    (Array.isArray(payload.roles) && 
                    (payload.roles.includes(ROLES.MEDICO_CE) || 
                     payload.roles.includes(ROLES.PROGRAMAS)));
    isArchivoClinico.value = Array.isArray(payload.roles) && payload.roles.includes(ROLES.ARCHIVO);
    isTriaje.value = Array.isArray(payload.roles) && 
                    (payload.roles.includes(ROLES.TRIAJE) || 
                     payload.roles.includes(ROLES.ENFERMERIA));
    isProgramas.value = Array.isArray(payload.roles) && payload.roles.includes(ROLES.PROGRAMAS);

    // Verificar permisos específicos para acciones
    const tienePermisoRegistrarCitas = Array.isArray(payload.permisos) &&
      payload.permisos.includes(PERMISOS.REGISTRAR_CITAS);
    
    const tienePrintPermiso = Array.isArray(payload.permisos) &&
      (payload.permisos.includes(PERMISOS.IMPRIMIR_BOLETA) || 
       payload.permisos.includes(PERMISOS.IMPRIMIR_HISTORICO));

    // Verificar acciones específicas para módulos
    const tieneAccionAgregarCitas = Array.isArray(payload.accionesItems) &&
      payload.accionesItems.some((a) => a.id === ITEMS.CITAS && a.a === 1);
    
    const tieneAccionConsultaTotal = Array.isArray(payload.accionesItems) &&
      payload.accionesItems.some((a) => a.id === ITEMS.PACIENTE && a.c === 1);
    
    const tieneAccionModificarAtencion = Array.isArray(payload.accionesItems) &&
      payload.accionesItems.some((a) => a.id === ITEMS.ATENCION_MEDICA && a.m === 1);
    
    const tieneAccionTriaje = Array.isArray(payload.accionesItems) &&
      payload.accionesItems.some((a) => a.id === ITEMS.TRIAJE && a.a === 1);

    // Permisos compuestos basados en roles y acciones
    canRegisterAppointments.value = isAdmin.value || 
                                   isRecepcion.value || 
                                   tienePermisoRegistrarCitas || 
                                   tieneAccionAgregarCitas;

    canPerformTriage.value = isAdmin.value || 
                            isTriaje.value || 
                            tieneAccionTriaje;

    // Médicos CE pueden registrar cualquier atención médica
    // Médicos de Programas solo pueden ver sus propias consultas
    const esMedicoCE = isMedico.value && 
                       Array.isArray(payload.roles) && 
                       payload.roles.includes(ROLES.MEDICO_CE);
    
    // Permisos especiales para médicos
    canRegisterMedicalAttention.value = isAdmin.value || 
                                       esMedicoCE || 
                                       tieneAccionModificarAtencion;
    
    canViewAllAppointments.value = isAdmin.value || 
                                  isRecepcion.value || 
                                  esMedicoCE || 
                                  tieneAccionConsultaTotal;
    
    canViewOnlyOwnAppointments.value = isProgramas.value && 
                                      !isAdmin.value && 
                                      !esMedicoCE;
    
    canViewAllPatients.value = isAdmin.value || 
                              isRecepcion.value || 
                              isArchivoClinico.value || 
                              esMedicoCE || 
                              tieneAccionConsultaTotal;

    canPrintDocuments.value = isAdmin.value || 
                             tienePrintPermiso;

    console.log("Permisos recalculados desde token:", {
      isAdmin: isAdmin.value,
      isRecepcion: isRecepcion.value,
      isMedico: isMedico.value,
      isProgramas: isProgramas.value,
      isTriaje: isTriaje.value,
      isArchivoClinico: isArchivoClinico.value,
      canRegisterAppointments: canRegisterAppointments.value,
      canPerformTriage: canPerformTriage.value,
      canRegisterMedicalAttention: canRegisterMedicalAttention.value,
      canViewAllAppointments: canViewAllAppointments.value,
      canViewOnlyOwnAppointments: canViewOnlyOwnAppointments.value,
      canViewAllPatients: canViewAllPatients.value,
      canPrintDocuments: canPrintDocuments.value
    });

    // Emitir un evento global para notificar que los permisos cambiaron
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("permissions-updated"));
    }

    return true;
  } catch (error) {
    console.error("Error al decodificar token o calcular permisos:", error);
    resetAllPermissions();
    return false;
  }
}

// Función para resetear todos los permisos
function resetAllPermissions() {
  isAdmin.value = false;
  isRecepcion.value = false;
  isMedico.value = false;
  isArchivoClinico.value = false;
  isTriaje.value = false;
  isProgramas.value = false;
  canRegisterAppointments.value = false;
  canPerformTriage.value = false;
  canRegisterMedicalAttention.value = false;
  canViewAllAppointments.value = false;
  canViewOnlyOwnAppointments.value = false;
  canViewAllPatients.value = false;
  canPrintDocuments.value = false;
}

export function usePermissions() {
  return {
    // Variables reactivas
    isAdmin,
    isRecepcion,
    isMedico,
    isArchivoClinico,
    isTriaje,
    isProgramas,
    canRegisterAppointments,
    canPerformTriage,
    canRegisterMedicalAttention,
    canViewAllAppointments,
    canViewOnlyOwnAppointments,
    canViewAllPatients,
    canPrintDocuments,

    // Funciones helpers
    hasRole: (roleId) => {
      // Leer directamente del token
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const payload = JSON.parse(atob(token.split(".")[1]));
        return Array.isArray(payload.roles) && payload.roles.includes(roleId);
      } catch (e) {
        console.error("Error verificando rol:", e);
        return false;
      }
    },

    hasPermission: (permisoId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const payload = JSON.parse(atob(token.split(".")[1]));
        return Array.isArray(payload.permisos) && payload.permisos.includes(permisoId);
      } catch (e) {
        console.error("Error verificando permiso:", e);
        return false;
      }
    },

    // Verificar si tiene la acción específica para un item
    hasItemAction: (itemId, action) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const payload = JSON.parse(atob(token.split(".")[1]));
        
        // Si es admin, siempre tiene todas las acciones
        if (Array.isArray(payload.roles) && payload.roles.includes(ROLES.ADMIN)) {
          return true;
        }
        
        // Verificar acciones específicas
        return Array.isArray(payload.accionesItems) && 
               payload.accionesItems.some(item => {
                 if (item.id !== itemId) return false;
                 
                 switch(action) {
                   case 'agregar': return item.a === 1;
                   case 'modificar': return item.m === 1;
                   case 'eliminar': return item.e === 1;
                   case 'consultar': return item.c === 1;
                   default: return false;
                 }
               });
      } catch (e) {
        console.error("Error verificando acción de item:", e);
        return false;
      }
    },

    // Ver si un médico solo debe ver sus propias citas
    shouldFilterByDoctor: () => {
      return canViewOnlyOwnAppointments.value && isMedico.value;
    },

    // Función para actualización manual
    recalcularPermisos: recalcularPermisosDesdeToken,

    // Constantes
    ROLES,
    ITEMS,
    PERMISOS,
  };
}
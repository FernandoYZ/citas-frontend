// stores/sidebar.ts
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { sidebarData } from "~/models/sidebar";
import { usePermissions } from "~/composables/usePermissions";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    sections: sidebarData,
    mobileOpen: false, // Comienza cerrado en móvil
    currentPath: "/", // Guardar la ruta actual para sincronización
  }),

  getters: {
    // Añadimos getters para comprobar si un módulo o submódulo está activo
    isActiveModule: (state) => (moduleId: string) => {
      for (const section of state.sections) {
        for (const module of section.modules) {
          if (module.id === moduleId && module.active) {
            return true;
          }
        }
      }
      return false;
    },

    isActiveSubmodule: (state) => (submoduleId: string) => {
      for (const section of state.sections) {
        for (const module of section.modules) {
          if (module.submodules) {
            for (const submodule of module.submodules) {
              if (submodule.id === submoduleId && submodule.active) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },
  },

  actions: {
    toggleModule(moduleId: string) {
      // Validar que estamos en el cliente
      if (!import.meta.client) return;

      // Obtener el router
      const router = useRouter();

      for (const section of this.sections) {
        for (const module of section.modules) {
          if (module.id === moduleId) {
            // Si el módulo tiene submodulos, solo expandir/contraer sin cambiar el active
            if (module.submodules && module.submodules.length > 0) {
              // Toggle expanded state
              module.expanded = !module.expanded;

              // No cambiar estados active aquí
              // Solo navegar si se hace clic en un módulo sin submódulos
            } else if (module.route) {
              // Si el módulo no tiene submodulos pero tiene ruta, navegar directamente
              this.resetActiveStates();
              module.active = true;
              router.push(module.route);
              this.currentPath = module.route;
              
              // En móvil, cerrar el sidebar después de la navegación
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                this.closeMobileSidebar();
              }
            }

            return;
          }
        }
      }
    },

    setActiveSubmodule(moduleId: string, submoduleId: string) {
      // Validar que estamos en el cliente
      if (!import.meta.client) return;

      // Obtener el router
      const router = useRouter();

      for (const section of this.sections) {
        for (const module of section.modules) {
          if (module.id === moduleId) {
            if (module.submodules) {
              for (const submodule of module.submodules) {
                if (submodule.id === submoduleId) {
                  // Restablecer todos los estados activos
                  this.resetActiveStates();

                  // Activar este módulo y submódulo específico
                  module.active = true;
                  submodule.active = true;

                  // Asegurarse de que el módulo está expandido
                  module.expanded = true;

                  // Navegar a la ruta del submódulo
                  if (submodule.route) {
                    router.push(submodule.route);
                    this.currentPath = submodule.route;
                    
                    // En móvil, cerrar el sidebar después de la navegación
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      this.closeMobileSidebar();
                    }
                  }

                  return;
                }
              }
            }
          }
        }
      }
    },

    // Método para sincronizar el estado del sidebar con la ruta actual
    syncWithRoute(path: string) {
      // No hacer nada si la ruta no ha cambiado
      if (this.currentPath === path) return;

      this.currentPath = path;

      // Si estamos en la página de inicio o en una ruta no definida, ningún módulo debe estar activo
      let matchFound = false;

      for (const section of this.sections) {
        for (const module of section.modules) {
          // Comprobar si es un módulo directo
          if (module.route === path) {
            this.resetActiveStates();
            module.active = true;
            matchFound = true;
            break;
          }

          // Comprobar si es un submódulo
          if (module.submodules) {
            for (const submodule of module.submodules) {
              if (submodule.route === path) {
                this.resetActiveStates();
                module.active = true;
                module.expanded = true;
                submodule.active = true;
                matchFound = true;
                break;
              }
            }
            if (matchFound) break;
          }
          
          // Verificar patrones parciales de ruta (para rutas dinámicas)
          if (!matchFound && path.startsWith('/') && path.length > 1) {
            const pathSegments = path.split('/').filter(Boolean); // Elimina elementos vacíos
            
            if (pathSegments.length > 0 && module.id === pathSegments[0]) {
              // Si la ruta comienza con el ID del módulo
              if (module.submodules && pathSegments.length > 1) {
                // Buscar submódulo que coincida con el segundo segmento
                for (const submodule of module.submodules) {
                  if (submodule.id === pathSegments[1] || 
                     (submodule.route && submodule.route.includes(`/${pathSegments[0]}/${pathSegments[1]}`))) {
                    this.resetActiveStates();
                    module.active = true;
                    module.expanded = true;
                    submodule.active = true;
                    matchFound = true;
                    break;
                  }
                }
              } else if (!module.submodules || module.submodules.length === 0) {
                // Si es un módulo sin submódulos
                this.resetActiveStates();
                module.active = true;
                matchFound = true;
              }
              
              if (matchFound) break;
            }
          }
        }
        if (matchFound) break;
      }
      
      // Si no se encontró coincidencia, resetear todo para que nada esté activo
      if (!matchFound) {
        this.resetActiveStates();
      }
    },

    resetActiveStates() {
      for (const section of this.sections) {
        for (const module of section.modules) {
          module.active = false;

          if (module.submodules) {
            for (const submodule of module.submodules) {
              submodule.active = false;
            }
          }
        }
      }
    },

    filterSectionsByPermissions() {
      const permissions = usePermissions();
      
      const isAdmin = permissions.isAdmin.value;
      const isMedico = permissions.isMedico.value;
      const canRegisterAppointments = permissions.canRegisterAppointments.value;
      const canPerformTriage = permissions.canPerformTriage.value;
      
      console.log("SIDEBAR - Filtrando secciones con permisos:", {
        isAdmin,
        isMedico,
        canRegisterAppointments,
        canPerformTriage
      });
      
      // Filtrar secciones según permisos
      this.sections = this.sections.map(section => {
        // Filtrar módulos en cada sección
        const filteredModules = section.modules.filter(module => {
          // Lógica para cada módulo basada en permisos
          switch(module.id) {
            case 'hospitalizacion': // Citas Estrategia
              return true; // Todos pueden ver el módulo principal
              
            case 'registro_citas':
              // Asegurar que administradores siempre puedan ver esta sección
              return isAdmin.value || canRegisterAppointments.value;
              
            case 'triaje':
              return isAdmin.value || usePermissions().canPerformTriage.value;
              
            case 'atencion_medica':
              return isAdmin.value || (isMedico.value && usePermissions().hasRole(149).value);
              
            // Agregar más casos según los módulos de tu aplicación
              
            default:
              return isAdmin.value; // Por defecto, solo admin ve módulos sin permisos específicos
          }
        });
        
        return {
          ...section,
          modules: filteredModules
        };
      }).filter(section => section.modules.length > 0); // Eliminar secciones vacías
    },

    toggleMobileSidebar() {
      this.mobileOpen = !this.mobileOpen;
    },

    closeMobileSidebar() {
      this.mobileOpen = false;
    },
    
    openMobileSidebar() {
      this.mobileOpen = true;
    }
  },
});
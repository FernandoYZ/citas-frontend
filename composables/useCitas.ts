// composables/useCitas.ts
import { ref, computed, onUnmounted, watch } from "vue";
import { citasService } from "~/services/CitasService";
import type { Cita } from "~/interfaces/Cita";

export function useCitas() {
  const citas = ref<Cita[]>([]);
  const isLoading = ref(false);
  const error = ref("");
  let pollingInterval: ReturnType<typeof setInterval> | null = null;
  
  // Estado para citas cargadas por rango de fecha
  const citasCargadas = ref<{[key: string]: boolean}>({});

  // Estado para almacenar rango de fechas actual para el polling
  const currentPollingDateRange = ref({
    fechaInicio: "",
    fechaFin: ""
  });
  
  // Obtener la fecha actual en formato YYYY-MM-DD
  const getFechaActual = (): string => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Inicializar la fecha actual una sola vez
  const fechaActual = ref(getFechaActual());
  
  const fetchCitas = async (fechaInicio?: string, fechaFin?: string) => {
    try {
      isLoading.value = true;
      error.value = "";

      // Retardo mínimo para evitar parpadeos rápidos
      const minLoadTime = 300; // 300ms mínimo para loading
      const startTime = Date.now();

      // IMPORTANTE: Establecer fechas de consulta
      const fechaInicioConsulta = fechaInicio || currentPollingDateRange.value.fechaInicio || fechaActual.value;
      const fechaFinConsulta = fechaFin || currentPollingDateRange.value.fechaFin || fechaInicioConsulta;
      
      console.log("[fetchCitas] Consultando rango:", fechaInicioConsulta, "a", fechaFinConsulta);
      
      // Actualizar las referencias de fecha
      if (fechaInicio) {
        currentPollingDateRange.value.fechaInicio = fechaInicio;
      }
      if (fechaFin) {
        currentPollingDateRange.value.fechaFin = fechaFin || fechaInicio;
      }

      const citasData = await citasService.getCitasSeparadas(fechaInicioConsulta, fechaFinConsulta);
      
      // Asegurar tiempo mínimo de loading para evitar parpadeos
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
      }
      
      // Crear clave para el caché basada en el rango de fechas
      const cacheKey = `${fechaInicioConsulta}_${fechaFinConsulta}`;
      
      // Actualizar datos y marcar como cargados
      citas.value = citasData;
      citasCargadas.value[cacheKey] = true;

      return citas.value;
    } catch (err) {
      console.error("[fetchCitas] Error al cargar citas:", err);
      error.value =
        err instanceof Error ? err.message : "Error al cargar las citas";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Actualizar silenciosamente (sin mostrar loading o errores)
  const refreshSilently = async (fechaInicio?: string, fechaFin?: string) => {
    try {
      // Usar valores proporcionados o los actuales
      const fechaInicioConsulta = fechaInicio || currentPollingDateRange.value.fechaInicio || fechaActual.value;
      const fechaFinConsulta = fechaFin || currentPollingDateRange.value.fechaFin || fechaInicioConsulta;
      
      // Crear clave para el caché
      const cacheKey = `${fechaInicioConsulta}_${fechaFinConsulta}`;
      
      // Solo refrescar si las citas ya fueron cargadas inicialmente
      if (!citasCargadas.value[cacheKey]) {
        console.log(`[refreshSilently] Rango ${fechaInicioConsulta} a ${fechaFinConsulta} no ha sido cargado inicialmente, omitiendo actualización silenciosa`);
        return citas.value;
      }
      
      console.log("[refreshSilently] Actualizando para rango:", fechaInicioConsulta, "a", fechaFinConsulta);
      
      const nuevasCitas = await citasService.getCitasSeparadas(fechaInicioConsulta, fechaFinConsulta);
      
      // Actualizar solo si hay cambios para evitar bucles reactivos
      if (JSON.stringify(citas.value) !== JSON.stringify(nuevasCitas)) {
        console.log("[refreshSilently] Actualizando datos por cambios detectados");
        citas.value = nuevasCitas;
      }
      
      return citas.value;
    } catch (err) {
      console.error("[refreshSilently] Error en actualización silenciosa:", err);
      // No afectar el estado general con errores silenciosos
      return citas.value;
    }
  };

  // Función para cargar detalles de una cita específica
  const loadCitaDetails = async (idCita: number, idPaciente: number) => {
    try {
      const detalles = await citasService.getCitaDetallada(idCita, idPaciente);
      return detalles;
    } catch (err) {
      console.error("[loadCitaDetails] Error al cargar detalles:", err);
      throw err;
    }
  };

  // Iniciar poll automático con enfoque adaptativo
  const startPolling = (interval: number = 15000, fechaInicio?: string, fechaFin?: string) => {
    // Siempre detener el polling existente primero
    stopPolling();
    
    // Verificar que el intervalo sea al menos 5 segundos para evitar sobrecarga
    const safeInterval = Math.max(5000, interval);
    
    // Actualizar las fechas de polling si se proporcionan
    if (fechaInicio) {
      currentPollingDateRange.value.fechaInicio = fechaInicio;
      currentPollingDateRange.value.fechaFin = fechaFin || fechaInicio;
    }
    
    console.log(`[startPolling] Iniciando polling cada ${safeInterval/1000} segundos para rango:`, 
      currentPollingDateRange.value.fechaInicio, "a", currentPollingDateRange.value.fechaFin);
    
    // Implementación con backoff exponencial para reducir carga
    let consecutiveNoChanges = 0;
    let currentInterval = safeInterval;
    
    pollingInterval = setInterval(() => {
      // Solo hacer polling si la página está activa
      if (!document.hidden) {
        console.log(`[polling] Ejecutando polling para rango: ${currentPollingDateRange.value.fechaInicio} a ${currentPollingDateRange.value.fechaFin} (intervalo: ${currentInterval/1000}s)`);
        
        refreshSilently(
          currentPollingDateRange.value.fechaInicio, 
          currentPollingDateRange.value.fechaFin
        ).then(result => {
          // Si no hay cambios, aumentar el contador
          if (JSON.stringify(result) === JSON.stringify(citas.value)) {
            consecutiveNoChanges++;
            // Si llevamos 3 o más consultas sin cambios, aumentar el intervalo
            if (consecutiveNoChanges >= 3) {
              // Máximo intervalo: 1 minuto
              currentInterval = Math.min(currentInterval * 1.5, 60000);
              // Reiniciar el intervalo
              stopPolling();
              pollingInterval = setInterval(() => {
                // La misma lógica, pero con el nuevo intervalo
                if (!document.hidden) {
                  refreshSilently(
                    currentPollingDateRange.value.fechaInicio,
                    currentPollingDateRange.value.fechaFin
                  );
                }
              }, currentInterval);
              
              console.log(`[polling] Ajustando intervalo a ${currentInterval/1000}s por inactividad`);
            }
          } else {
            // Si hubo cambios, resetear contador y volver al intervalo normal
            consecutiveNoChanges = 0;
            if (currentInterval !== safeInterval) {
              currentInterval = safeInterval;
              stopPolling();
              pollingInterval = setInterval(() => {
                if (!document.hidden) {
                  refreshSilently(
                    currentPollingDateRange.value.fechaInicio,
                    currentPollingDateRange.value.fechaFin
                  );
                }
              }, currentInterval);
              
              console.log(`[polling] Restaurando intervalo a ${currentInterval/1000}s por actividad detectada`);
            }
          }
        });
      } else {
        console.log("[polling] Página inactiva, omitiendo actualización");
      }
    }, currentInterval);
    
    return () => stopPolling();
  };

  // Detener polling
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
      console.log("[stopPolling] Polling detenido");
    }
  };

  // Agregar una nueva cita a la lista
  const agregarCita = (nuevaCita: Cita) => {
    citas.value = [nuevaCita, ...citas.value];
  };

  // Actualizar una cita existente de forma eficiente
  const actualizarCita = (citaActualizada: Cita) => {
    if (!citaActualizada.IdAtencion) return;

    const index = citas.value.findIndex(
      (c) => c.IdAtencion === citaActualizada.IdAtencion
    );

    if (index !== -1) {
      // Solo actualizar las propiedades que cambiaron
      const citaAnterior = citas.value[index];
      const citaActual = { ...citaAnterior };
      
      // Actualizar solo las propiedades que cambiaron
      let cambios = false;
      
      Object.keys(citaActualizada).forEach(key => {
        if (JSON.stringify(citaActual[key]) !== JSON.stringify(citaActualizada[key])) {
          citaActual[key] = citaActualizada[key];
          cambios = true;
        }
      });
      
      // Solo actualizar si hay cambios reales
      if (cambios) {
        citas.value[index] = citaActual;
        console.log("[actualizarCita] Cita actualizada:", citaActual);
      }
    }
  };

  // Verificar si hay citas cargadas
  const hayCitas = computed(() => citas.value.length > 0);

  // Limpieza al desmontar
  onUnmounted(() => {
    stopPolling();
  });

  // Escuchar cambios en la visibilidad para pausar/reanudar polling
  watch(() => document.visibilityState, (newState) => {
    if (newState === 'visible' && pollingInterval) {
      console.log("[visibilityChange] Página visible, actualizando inmediatamente");
      refreshSilently(
        currentPollingDateRange.value.fechaInicio,
        currentPollingDateRange.value.fechaFin
      );
    }
  });

  return {
    citas,
    fechaActual,
    currentPollingDateRange,
    isLoading,
    error,
    hayCitas,
    fetchCitas,
    refreshSilently,
    loadCitaDetails,
    startPolling,
    stopPolling,
    agregarCita,
    actualizarCita,
    getFechaActual,
  };
}

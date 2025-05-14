// composables/useCitas.ts
import { ref, computed } from "vue";
import { citasService } from "~/services/CitasService";
import type { Cita } from "~/interfaces/Cita";

export function useCitas() {
  const citas = ref<Cita[]>([]);
  const isMedico = ref(false);
  const isLoading = ref(false);
  const error = ref("");
  let pollingInterval: any = null;
  
  // Obtener la fecha actual en formato YYYY-MM-DD
  const getFechaActual = (): string => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const fechaActual = ref(getFechaActual());
  // Obtener las citas del día (o para una fecha específica)
  const fetchCitas = async (fecha?: string) => {
    try {
      isLoading.value = true;
      error.value = "";

      // Retardo mínimo para evitar parpadeos rápidos (se ve mejor con una duración mínima)
      const minLoadTime = 300; // 300ms mínimo para loading
      const startTime = Date.now();

      // Usar la fecha proporcionada o la fecha actual
      const fechaConsulta = fecha || getFechaActual();
      
      // Actualizar la fecha actual guardada
      fechaActual.value = fechaConsulta;

      const citasData = await citasService.getCitasSeparadas(fechaConsulta);
      
      // Asegurar tiempo mínimo de loading para evitar parpadeos
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
      }
      
      // Actualizar datos
      citas.value = citasData;

      return citas.value;
    } catch (err) {
      console.error("Error al cargar citas:", err);
      error.value =
        err instanceof Error ? err.message : "Error al cargar las citas";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Actualizar silenciosamente (sin mostrar loading o errores)
  const refreshSilently = async (fecha?: string) => {
  try {
    // Añadir un log para identificar cuándo se llama
    console.log("Actualizando silenciosamente para fecha:", fecha);
    
    const fechaConsulta = fecha || fechaActual.value || getFechaActual();
    const nuevasCitas = await citasService.getCitasSeparadas(fechaConsulta);
    
    // Actualizar solo si hay cambios para evitar bucles reactivos
    if (JSON.stringify(citas.value) !== JSON.stringify(nuevasCitas)) {
      citas.value = nuevasCitas;
    }
  } catch (err) {
    console.error("Error en actualización silenciosa:", err);
  }
};

  // Iniciar poll automático
  const startPolling = (interval: number = 15000, fecha?: string) => {
    // Siempre detener el polling existente primero
    stopPolling();
    
    // Verificar que el intervalo sea al menos 5 segundos para evitar sobrecarga
    const safeInterval = Math.max(5000, interval);
    
    console.log(`Iniciando polling cada ${safeInterval/1000} segundos`);
    
    const fechaConsulta = fecha || fechaActual.value || getFechaActual();
    pollingInterval = setInterval(() => refreshSilently(fechaConsulta), safeInterval);
    
    return () => stopPolling();
  };

  // Detener polling
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  };

  // Agregar una nueva cita a la lista
  const agregarCita = (nuevaCita: Cita) => {
    citas.value = [nuevaCita, ...citas.value];
  };

  // Actualizar una cita existente
  const actualizarCita = (citaActualizada: Cita) => {
    if (!citaActualizada.IdAtencion) return;

    const index = citas.value.findIndex(
      (c) => c.IdAtencion === citaActualizada.IdAtencion
    );

    if (index !== -1) {
      citas.value[index] = { ...citas.value[index], ...citaActualizada };
    }
  };

  // Verificar si hay citas cargadas
  const hayCitas = computed(() => citas.value.length > 0);

  return {
    citas,
    fechaActual,
    isLoading,
    error,
    hayCitas,
    fetchCitas,
    refreshSilently,
    startPolling,
    stopPolling,
    agregarCita,
    actualizarCita,
    getFechaActual,
  };
}

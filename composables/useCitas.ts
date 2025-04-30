// composables/useCitas.ts
import { ref, computed } from "vue";
import { citasService } from "~/services/CitasService";
import type { Cita } from "~/interfaces/Cita";

export function useCitas() {
  const citas = ref<Cita[]>([]);
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

  // Obtener las citas del día (o para una fecha específica)
  const fetchCitas = async (fecha?: string) => {
    try {
      isLoading.value = true;
      error.value = "";

      // Usar la fecha proporcionada o la fecha actual
      const fechaConsulta = fecha || getFechaActual();

      citas.value = await citasService.getCitasSeparadas(fechaConsulta);

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
      const fechaConsulta = fecha || getFechaActual();
      citas.value = await citasService.getCitasSeparadas(fechaConsulta);
    } catch (err) {
      console.error("Error en actualización silenciosa:", err);
    }
  };

  // Iniciar poll automático
  const startPolling = (interval: number = 15000, fecha?: string) => {
    stopPolling(); // Detener cualquier polling existente
    pollingInterval = setInterval(() => refreshSilently(fecha), interval);
    return () => stopPolling(); // Retornar función para detener
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

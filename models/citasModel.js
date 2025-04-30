// models/citasModel.js
import { ref, onUnmounted } from 'vue';

/**
 * Modelo para manejar los datos de citas médicas
 * Utiliza el patrón composable para proporcionar estado reactivo y métodos
 */
export const useCitasModel = () => {
  // Estado reactivo
  const citas = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const lastPollingTimestamp = ref(0);
  const pollingInterval = ref(null);
  
  // Fecha actual para filtros en formato peruano
  const fechaActual = new Date();
  const fechaActualPeru = fechaActual.toLocaleDateString('es-PE', { 
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // Formatear fecha para la API (MM/DD/YYYY)
  const formatDateForAPI = (fecha) => {
    if (!fecha) return '';
    
    // Si es string, intentar convertir a Date
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    
    // Formatear a MM/DD/YYYY para la API
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  };

  /**
   * Obtener todas las citas desde la API
   * @param {Object} options - Opciones para la petición
   * @param {boolean} options.showLoading - Si se debe mostrar el indicador de carga
   * @param {boolean} options.forceReload - Si se debe forzar la recarga aunque no haya cambios
   * @returns {Promise<Array>} Lista de citas
   */
  const fetchCitas = async (options = { showLoading: true, forceReload: false }) => {
    if (options.showLoading) {
      isLoading.value = true;
    }
    error.value = null;

    try {
      // URL de la API con fecha actual formateada
      const apiUrl = `http://localhost:3055/api/citas/citas-separadas?fecha=${formatDateForAPI(fechaActual)}`;
      
      // Añadir timestamp para evitar caché en forzado (sin usar cabeceras Cache-Control)
      const url = options.forceReload ? `${apiUrl}&_t=${Date.now()}` : apiUrl;
      
      // No incluir cabeceras que puedan causar problemas CORS
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Si hay nuevos datos o se fuerza recarga, actualizar las citas
      if (options.forceReload || hasNewData(data)) {
        citas.value = data;
        lastPollingTimestamp.value = Date.now();
        console.log('Citas actualizadas:', data.length);
      }
      
      return data;
    } catch (err) {
      console.error('Error al obtener citas:', err);
      error.value = err.message || 'Error al cargar las citas';
      return [];
    } finally {
      if (options.showLoading) {
        isLoading.value = false;
      }
    }
  };

  /**
   * Verificar si hay nuevos datos comparando con los actuales
   * @param {Array} newData - Nuevos datos a comparar
   * @returns {boolean} True si hay cambios
   */
  const hasNewData = (newData) => {
    // Si no hay datos actuales, es una carga inicial
    if (citas.value.length === 0) return true;
    
    // Si el número de citas es diferente, hay cambios
    if (newData.length !== citas.value.length) return true;
    
    // Comparar IDs de citas para detectar cambios en orden o contenido
    // Usar map para extraer solo los IDs y join para crear una cadena comparable
    const currentIds = citas.value.map(cita => cita.IdAtencion).join(',');
    const newIds = newData.map(cita => cita.IdAtencion).join(',');
    
    return currentIds !== newIds;
  };

  /**
   * Recargar datos sin mostrar indicador de carga
   * Útil para actualizaciones silenciosas
   */
  const refreshSilently = async () => {
    return await fetchCitas({ showLoading: false, forceReload: true });
  };
  
  /**
   * Inicia el polling automático para obtener nuevas citas
   * @param {number} intervalMs - Intervalo en milisegundos (por defecto 15 segundos)
   */
  const startPolling = (intervalMs = 15000) => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
    }
    
    pollingInterval.value = setInterval(async () => {
      console.log('Realizando polling automático...');
      await refreshSilently();
    }, intervalMs);
    
    console.log(`Polling iniciado cada ${intervalMs/1000} segundos`);
  };
  
  /**
   * Detiene el polling automático
   */
  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
      console.log('Polling detenido');
    }
  };
  
  /**
   * Agregar una nueva cita al modelo
   * @param {Object} nuevaCita - Datos de la nueva cita
   */
  const agregarCita = (nuevaCita) => {
    // Añadir la nueva cita al principio del array (modo prepend)
    citas.value = [nuevaCita, ...citas.value];

    refreshSilently();
  };
  
  /**
   * Actualizar una cita existente
   * @param {Object} citaActualizada - Datos actualizados de la cita
   * @param {string|number} idField - Campo a usar como identificador (por defecto IdAtencion)
   */
  const actualizarCita = (citaActualizada, idField = 'IdAtencion') => {
    const index = citas.value.findIndex(c => c[idField] === citaActualizada[idField]);
    
    if (index !== -1) {
      // Actualizar cita manteniendo reactividad
      citas.value[index] = { ...citas.value[index], ...citaActualizada };
    }
  };

  // Limpiar el intervalo al desmontar el componente
  onUnmounted(() => {
    stopPolling();
  });

  return {
    citas,
    isLoading,
    error,
    fechaActualPeru,
    fetchCitas,
    refreshSilently,
    agregarCita,
    actualizarCita,
    startPolling,
    stopPolling
  };
};
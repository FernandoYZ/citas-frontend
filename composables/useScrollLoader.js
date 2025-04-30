// composables/useScrollLoader.js
import { ref, onMounted, onUnmounted } from "vue";

/**
 * Composable para implementar carga bajo demanda al hacer scroll
 * Útil para grandes conjuntos de datos
 *
 * @param {Function} loadMoreCallback - Función a ejecutar cuando se necesita cargar más elementos
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Estado y métodos del scroll loader
 */
export function useScrollLoader(loadMoreCallback, options = {}) {
  const defaults = {
    threshold: 200, // Píxeles desde el final de la página para activar carga
    enabled: true, // Si el loader está activado
    debounceTime: 200, // Tiempo para limitar frecuencia de eventos de scroll
  };

  const config = { ...defaults, ...options };

  const isLoading = ref(false);
  const hasMoreItems = ref(true);
  const isEnabled = ref(config.enabled);

  // Función para verificar posición de scroll y cargar más elementos si es necesario
  let timeoutId = null;
  const checkScrollPosition = () => {
    if (timeoutId !== null) return;

    timeoutId = setTimeout(() => {
      timeoutId = null;

      if (!isEnabled.value || isLoading.value || !hasMoreItems.value) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Si estamos cerca del final, cargar más elementos
      if (scrollHeight - scrollTop - clientHeight < config.threshold) {
        loadMore();
      }
    }, config.debounceTime);
  };

  // Función para cargar más elementos
  const loadMore = async () => {
    if (isLoading.value || !hasMoreItems.value) return;

    isLoading.value = true;

    try {
      const result = await loadMoreCallback();

      // Si no hay más elementos para cargar, deshabilitar
      if (result && result.noMoreItems) {
        hasMoreItems.value = false;
      }
    } catch (error) {
      console.error("Error al cargar más elementos:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Habilitar/deshabilitar el loader
  const setEnabled = (value) => {
    isEnabled.value = value;
  };

  // Reiniciar el estado
  const reset = () => {
    hasMoreItems.value = true;
  };

  // Manejar eventos de scroll
  onMounted(() => {
    window.addEventListener("scroll", checkScrollPosition);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", checkScrollPosition);
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  });

  return {
    isLoading,
    hasMoreItems,
    isEnabled,
    loadMore,
    setEnabled,
    reset,
  };
}

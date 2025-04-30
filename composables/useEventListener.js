// composables/useEventListener.js
import { onMounted, onUnmounted } from 'vue';

/**
 * Composable para gestionar eventos DOM de manera limpia
 * Se encarga de adjuntar los eventos durante el montaje y eliminarlos durante el desmontaje
 * 
 * @param {HTMLElement|Window|Document} target - El elemento al que se adjuntará el evento
 * @param {String} event - Nombre del evento (click, resize, etc.)
 * @param {Function} handler - Función de manejo del evento
 * @param {Object} options - Opciones del evento (useCapture, passive, etc.)
 */
export function useEventListener(target, event, handler, options = {}) {
  // Si no estamos en el cliente, no hacer nada
  if (typeof window === 'undefined') return;
  
  onMounted(() => {
    // Cuando el componente se monta, adjuntar el evento
    target.addEventListener(event, handler, options);
  });
  
  onUnmounted(() => {
    // Cuando el componente se desmonta, eliminar el evento
    target.removeEventListener(event, handler, options);
  });
}
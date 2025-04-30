// composables/useSidebar
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSidebarStore } from '~/stores/sidebar';

export function useSidebar() {
  const sidebarStore = useSidebarStore();
  const route = useRoute();
  
  // Sincronizar el sidebar con la ruta actual
  const syncWithRoute = () => {
    sidebarStore.syncWithRoute(route.path);
  };
  
  // Observar cambios en la ruta
  watch(() => route.path, syncWithRoute, { immediate: true });
  
  if (import.meta.client) {
    // Sincronizar al montar el componente
    onMounted(() => {
      syncWithRoute();
      
      // Configurar los eventos de teclado para navegación accesible
      const setupKeyboardNavigation = () => {
        const menuItems = document.querySelectorAll('.sidebar a, .sidebar button');
        menuItems.forEach((item) => {
          item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (item instanceof HTMLElement) {
                item.click();
              }
            }
          });
        });
      };
      
      // Hacer que los elementos de menú sean focusables
      const makeMenuItemsFocusable = () => {
        const menuItems = document.querySelectorAll('.sidebar a, .sidebar button');
        menuItems.forEach((item) => {
          if (!item.hasAttribute('tabindex')) {
            item.setAttribute('tabindex', '0');
          }
        });
      };
      
      setupKeyboardNavigation();
      makeMenuItemsFocusable();
      
      // Configuramos un observador de mutaciones para aplicar tabindex a nuevos elementos
      const observer = new MutationObserver(makeMenuItemsFocusable);
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        observer.observe(sidebar, { childList: true, subtree: true });
      }
      
      // Limpiar el observador cuando se desmonte el componente
      onBeforeUnmount(() => {
        observer.disconnect();
      });
    });
  }
  
  return {
    sidebarStore
  };
}
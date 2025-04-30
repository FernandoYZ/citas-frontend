// composables/useNotification.js

import { ref } from 'vue';

// Container de notificaciones (singleton)
const notificationContainer = ref(null);

export function useNotification() {
  // Método para mostrar una notificación
  const show = ({ title = "Notificación", message = "", type = "info", duration = 5000 }) => {
    if (notificationContainer.value) {
      return notificationContainer.value.addNotification(title, message, type, duration);
    } else {
      console.warn('NotificationContainer no está inicializado.');
    }
  };

  // Método para eliminar una notificación por ID
  const remove = (id) => {
    if (notificationContainer.value) {
      const index = notificationContainer.value.notifications.value.findIndex(n => n.id === id);
      if (index !== -1) {
        notificationContainer.value.removeNotification(index);
      }
    }
  };

  // Método para limpiar todas las notificaciones
  const clear = () => {
    if (notificationContainer.value) {
      notificationContainer.value.clearNotifications();
    }
  };

  // Método para inicializar el container
  const setContainer = (container) => {
    notificationContainer.value = container;
  };

  return {
    show,
    remove,
    clear,
    setContainer
  };
}
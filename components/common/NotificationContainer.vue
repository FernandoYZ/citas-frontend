<!-- components/common/NotificationContainer -->
<template>
  <Teleport to="body">
    <div id="notification-portal" class="notification-container fixed top-8 right-4 w-80 max-w-full flex flex-col space-y-2">
      <transition-group
        name="notification"
        tag="div"
        class="flex flex-col space-y-2"
      >
        <Notification
          v-for="(notification, index) in notifications"
          :key="notification.id"
          :title="notification.title"
          :message="notification.message"
          :type="notification.type"
          :closable="true"
          :auto-close="true"
          :duration="notification.duration || 5000"
          @close="removeNotification(index)"
        />
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, defineExpose, onMounted } from "vue";
import Notification from "./Notification.vue";

// Array de notificaciones
const notifications = ref([]);

// Contador para IDs únicos
let nextId = 1;

// Añadir nueva notificación
const addNotification = (title, message, type = "info", duration = 5000) => {
  const id = nextId++;
  notifications.value.push({ id, title, message, type, duration });

  // Opcional: auto-eliminar si hay demasiadas notificaciones
  if (notifications.value.length > 5) {
    notifications.value.shift();
  }

  return id;
};

// Eliminar notificación
const removeNotification = (index) => {
  notifications.value.splice(index, 1);
};

// Limpiar todas las notificaciones
const clearNotifications = () => {
  notifications.value = [];
};

// Verificar que el portal de notificaciones esté correctamente configurado
onMounted(() => {
  // Comprobamos si ya existe un elemento con el ID notification-portal
  const existingPortal = document.getElementById('notification-portal');
  if (existingPortal) {
    // Si existe, asegúrate de que tenga el z-index correcto
    existingPortal.style.zIndex = '10000';
  }
});

// Exponer métodos para uso externo
defineExpose({
  addNotification,
  removeNotification,
  clearNotifications,
});
</script>

<style>
/* Contenedor de notificaciones con z-index alto para estar sobre todo */
.notification-container {
  position: fixed;
  pointer-events: auto;
}

/* Animación para las notificaciones */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
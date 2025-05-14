<template>
  <Html lang="es-PE">
    <div class="p-4">
      <slot />
      <CommonNotificationContainer ref="notificationContainerRef" />
    </div>
  </Html>
</template>

<script setup>
import { useNotification } from '~/composables/useNotification';
import { ref, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';

const notificationContainerRef = ref(null);
const notification = useNotification();
const { verifyAuth } = useAuth();
const router = useRouter();

onMounted(async () => {
  // Inicializar el contenedor de notificaciones
  notification.setContainer(notificationContainerRef.value);

  // Verificar si el usuario ya está autenticado
  if (import.meta.client) {
    const authenticated = await verifyAuth();
    if (authenticated) {
      console.log('Usuario ya autenticado en layout login, redirigiendo a /citas');
      router.push('/citas');
    }
  }
});
</script>
<template>
  <Html lang="es-PE">
    <div class="flex min-h-screen bg-gray-50">
      <!-- <AppSidebar /> -->
      <!-- :class="{
        'ml-0': !sidebarStore.mobileOpen,
        'ml-0 lg:ml-64': sidebarStore.mobileOpen,
      }" -->

      <div
        class="transition-all duration-300 flex-1 flex flex-col min-h-screen"
      >
        <AppNavbar />

        <main class="flex-1 overflow-y-auto pb-4">
          <CommonNotificationContainer ref="notificationContainerRef" />
          <slot />
        </main>

        <AppFooter />
      </div>
    </div>
  </Html>
</template>

<script setup>
import { useSidebarStore } from "~/stores/sidebar";
import { useSidebar } from "~/composables/useSidebar";
import { useNotification } from '~/composables/useNotification';
import { useAuth } from '~/composables/useAuth';
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useRouter } from 'vue-router';

const notificationContainerRef = ref(null);
const notification = useNotification();
const { verifyAuth } = useAuth();
const router = useRouter();

const sidebarStore = useSidebarStore();
useSidebar();

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarStore.openMobileSidebar();
  } else {
    sidebarStore.closeMobileSidebar();
  }
};

onMounted(async () => {
  // Estado inicial
  handleResize();
  // Agregar el listener para actualizar en cada cambio de tamaño
  window.addEventListener("resize", handleResize);
  // Inicializar el contenedor de notificaciones
  notification.setContainer(notificationContainerRef.value);

  // Verificar la autenticación de forma segura
  if (import.meta.client) {
    const authenticated = await verifyAuth();
    if (!authenticated && router.currentRoute.value.path !== '/login') {
      console.log('Usuario no autenticado en layout default, redirigiendo a login');
      router.push('/login');
    }
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener("resize", handleResize);
  }
});
</script>
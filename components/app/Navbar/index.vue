<!-- AppNavbar -->
<template>
  <header class="bg-white border-gray-200 border-b-[1.5px]">
    <div class="max-w-7xl mx-auto flex items-center justify-between py-2 px-4 lg:px-3">
      <div class="flex items-center space-x-3">
        <!-- Mobile Menu Toggle -->
        <button
          id="mobileMenuToggle"
          class="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
          @click="toggleMobileSidebar"
        >
          <i class="fas fa-bars text-lg" />
        </button>

        <!-- Breadcrumb -->
        <AppNavbarBreadcrumb />
      </div>

      <!-- User Section - Right side -->
      <div class="flex items-center space-x-3">
        <!-- User Profile Menu -->
        <div class="relative">
          <button
            class="flex items-center space-x-2 rounded-md bg-gray-100 hover:bg-gray-200 px-2 py-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1"
            data-menu="user"
            @click="toggleUserMenu"
          >
            <div
              class="w-8 h-8 rounded-md border-2 border-gray-200 flex items-center justify-center bg-blue-600 text-white text-sm font-bold"
            >
              {{ userInitials }}
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-sm font-medium text-gray-800">{{ userName }}</p>
              <p class="text-xs text-gray-500">{{ userRole  }}</p>
            </div>
            <svg
              class="hidden sm:block h-5 w-5 text-gray-500 transition-transform"
              :class="{ 'rotate-180': showUserMenu }"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            id="userMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200"
          >
            <a
              href="#"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <i class="fas fa-user mr-2 text-gray-500" /> Mi perfil
            </a>
            <a
              href="#"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <i class="fas fa-cog mr-2 text-gray-500" /> Configuración
            </a>
            <a
              href="#"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <i class="fas fa-hospital mr-2 text-gray-500" /> Mi institución
            </a>
            <div class="border-t border-gray-100 my-1" />
            <button
              class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              @click="handleLogout"
            >
              <i class="fas fa-sign-out-alt mr-2" /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onBeforeUnmount, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useNotification } from '~/composables/useNotification';
import { useRouter } from 'vue-router';
import { useSidebarStore } from "~/stores/sidebar";

const sidebarStore = useSidebarStore();

// Estado para los menús desplegables
const showUserMenu = ref(false);
const { logout } = useAuth();
const notification = useNotification();
const router = useRouter();

// Alternar los menús al hacer clic
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// Alternar el sidebar móvil
const toggleMobileSidebar = () => {
  sidebarStore.toggleMobileSidebar();
};

const getUserInfoFromToken = () => {
  if (import.meta.client) {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decodificar el token (solo la parte de payload)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error("Error decodificando token:", e);
      }
    }
  }
  return null;
};

// Información del usuario obtenida del token
const tokenInfo = computed(() => getUserInfoFromToken());

// Obtener rol desde localStorage
const userRole = computed(() => {
  if (import.meta.client) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      return userData.rol || 'Hospital Rezola';
    }
  }
  return 'Usuario';
});

// Nombre completo del usuario
const userName = computed(() => {
  const info = tokenInfo.value;
  if (info && info.nombre && info.apellido) {
    const firstName = info.nombre.split(' ')[0]; // Tomar solo el primer nombre
    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const capitalizedLastName = info.apellido.charAt(0).toUpperCase() + info.apellido.slice(1).toLowerCase();
    return `${capitalizedFirstName} ${capitalizedLastName}`;
  }
  return "Usuario";
});

// Iniciales para el avatar
const userInitials = computed(() => {
  const info = tokenInfo.value;
  if (info && info.nombre && info.apellido) {
    return `${info.nombre[0]}${info.apellido[0]}`.toUpperCase();
  }
  return "U";
});

// Función para manejar el cierre de sesión
const handleLogout = () => {
  // Cerrar primero el menú
  showUserMenu.value = false;
  
  // Llamar a la función de logout
  logout();
  
  // Mostrar notificación
  notification.show({
    type: 'success',
    title: 'Sesión cerrada',
    message: 'Ha cerrado sesión correctamente',
    duration: 3000
  });
  
  // Redireccionar a login
  router.push('/login');
};

// Cerrar menús al hacer clic fuera
const handleClickOutside = (event) => {
  const userButton = document.querySelector('[data-menu="user"]');
  const userMenu = document.getElementById("userMenu");

  // Verifica si los elementos existen antes de comprobar la ruta
  if (showUserMenu.value && userButton && userMenu) {
    if (
      !event.composedPath().includes(userButton) &&
      !event.composedPath().includes(userMenu)
    ) {
      showUserMenu.value = false;
    }
  }
};

// Cerrar menús con la tecla Escape
const handleKeydown = (event) => {
  if (event.key === "Escape") {
    showUserMenu.value = false;
  }
};

// Configurar listeners al montar y limpiar al desmontar
onMounted(() => {
  if (typeof window !== "undefined") {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeydown);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleKeydown);
  }
});


</script>


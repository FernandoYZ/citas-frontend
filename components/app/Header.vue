<!-- AppHeader -->
<template>
  <header class="bg-white border-gray-200 border-b-[1.5px]">
    <div class="flex items-center justify-between py-2 px-4 lg:px-6">
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
            class="flex items-center space-x-2 rounded-md bg-gray-100 hover:bg-gray-200 px-2 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              <p class="text-xs text-gray-500">{{ userOrganization }}</p>
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
                clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div v-if="showUserMenu" id="userMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200">
            <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <i class="fas fa-user mr-2 text-gray-500"/> Mi perfil
            </a>
            <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <i class="fas fa-cog mr-2 text-gray-500"/> Configuración
            </a>
            <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <i class="fas fa-hospital mr-2 text-gray-500"/> Mi institución
            </a>
            <div class="border-t border-gray-100 my-1"/>
            <a href="#" class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              <i class="fas fa-sign-out-alt mr-2"/> Cerrar sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onBeforeUnmount, onMounted } from 'vue';
import { useSidebarStore } from '~/stores/sidebar';

const sidebarStore = useSidebarStore();

// Estado para los menús desplegables
const showUserMenu = ref(false);

// Alternar los menús al hacer clic
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// Alternar el sidebar móvil
const toggleMobileSidebar = () => {
  sidebarStore.toggleMobileSidebar();
};

// Cerrar menús al hacer clic fuera
const handleClickOutside = (event) => {
  const userButton = document.querySelector('[data-menu="user"]');
  const userMenu = document.getElementById('userMenu');
  
  // Verifica si los elementos existen antes de comprobar la ruta
  if (showUserMenu.value && userButton && userMenu) {
    if (!event.composedPath().includes(userButton) && 
        !event.composedPath().includes(userMenu)) {
      showUserMenu.value = false;
    }
  }
};

// Cerrar menús con la tecla Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    showUserMenu.value = false;
  }
};

// Configurar listeners al montar y limpiar al desmontar
onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleKeydown);
  }
});

// Usuario - Puedes reemplazar esto con datos reales de un store de autenticación
const userName = ref('Dr. Alejandro W.');
const userOrganization = ref('Regional Hospital');
const userInitials = computed(() => {
  const names = userName.value.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`;
  }
  return names[0][0];
});

</script>
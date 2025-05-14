<template>
  <div
    ref="pageContainer"
    class="min-h-screen w-full bg-gradient-to-br from-gray-50 to-primario-50 flex items-center justify-center transition-all duration-300"
  >
    <div
      class="w-full max-w-6xl overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl flex flex-col lg:flex-row"
    >
      <!-- Left panel - Branding and vision (hidden on mobile) -->
      <div
        class="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primario-600 to-primario-900 relative overflow-hidden"
      >
        <!-- Background image with subtle hover effect -->
        <div
          class="absolute inset-0 bg-cover bg-center opacity-20 transform transition-transform duration-3000 ease-out"
          :class="{'scale-105': isHovered}"
          style="background-image: url('/fonde_rezola.webp')"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
        />

        <!-- Gradient overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-primario-800/40 via-primario-900/50 to-primario-950/60"
        />
        
        <!-- Left panel content -->
        <div
          class="relative z-10 flex flex-col justify-between h-full px-12 py-8 text-white"
        >
          <!-- Main message -->
          <div class="space-y-6 max-w-md mt-2">
            <div ref="headerContainer" class="opacity-0 transform translate-y-4 transition-all duration-300">
              <div class="flex items-center space-x-3 mb-6">
                <div class="h-10 w-2 bg-white/20 rounded-full"/>
                <h1 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                  Sistema <span class="text-primario-200">Integrado</span> Hospitalario
                </h1>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div ref="footerContainer" class="opacity-0 transform translate-y-4 transition-all duration-300">
            <div class="flex items-center mb-4">
              <div class="w-8 h-1 bg-primario-400/40 rounded-full mr-3"/>
              <span class="text-sm text-primario-100/90 font-light">Atención Médica de Excelencia</span>
            </div>
            <div class="text-sm text-primario-100/70">
              © {{ new Date().getFullYear() }} Hospital Rezola Cañete
            </div>
          </div>
        </div>
      </div>

      <!-- Right panel - Login form -->
      <div class="w-full lg:w-1/2">
        <!-- Mobile header (only shown on mobile) -->
        <div class="lg:hidden bg-primario-700 px-6 py-4 text-white">
          <div class="flex items-center justify-start">
            <div class="p-2 bg-white/10 rounded-xl mr-3">
              <NuxtImg
                src="/logo.webp"
                alt="Logo del Hospital"
                class="h-10 w-auto"
              />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">
                Hospital Regional
              </h2>
              <p class="text-xs text-primario-100 flex items-center">
                Rezola - Cañete
              </p>
            </div>
          </div>
        </div>
        
        <!-- Form container -->
        <div class="flex items-center justify-center p-6 md:p-10">
          <div ref="formContainer" class="w-full max-w-md space-y-6 transition-all opacity-0 transform translate-y-4 duration-300">
            <!-- Logo and hospital name (only on desktop) -->
            <div class="hidden lg:flex items-center justify-start mb-8">
              <div class="p-3 bg-primario-100 rounded-2xl mr-4 group hover:bg-primario-200 transition-colors duration-300">
                <NuxtImg
                  src="/logo.webp"
                  alt="Logo del Hospital"
                  class="h-14 w-auto transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-primario-900">
                  Hospital Regional
                </h2>
                <p class="text-sm text-gray-600 flex items-center">
                  Rezola - Cañete
                </p>
              </div>
            </div>

            <!-- Form header -->
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">Bienvenido de nuevo</h2>
              <div class="flex items-center">
                <div class="w-12 h-1 bg-primario-600 rounded-full mr-3"/>
                <p class="text-gray-600">Inicia sesión para ingresar al sistema</p>
              </div>
            </div>

            <!-- Form -->
            <form class="space-y-5" @submit.prevent="iniciarSesion">
              <!-- Username field -->
              <div class="space-y-2">
                <label
                  for="usuario"
                  class="text-sm font-medium text-gray-700 ml-1 flex items-center"
                >
                  <i class="fas fa-id-card text-primario-600 mr-2"/>
                  Nombre de usuario
                </label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-200"
                  >
                    <i class="fas fa-user text-gray-400 group-focus-within:text-primario-600 transition-colors duration-200"/>
                  </div>
                  <input
                    id="usuario"
                    v-model="credentials.usuario"
                    type="text"
                    required
                    placeholder="Ingrese su identificación"
                    class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-primario-500/20 focus:border-primario-500 transition-all duration-200 text-sm"
                    :class="{ 'bg-primario-50/50 border-primario-200': credentials.usuario }"
                  >
                </div>
              </div>

              <!-- Password field -->
              <div class="space-y-2">
                <div class="flex items-center justify-between ml-1">
                  <label
                    for="password"
                    class="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <i class="fas fa-lock text-primario-600 mr-2"/>
                    Contraseña
                  </label>
                  <a
                    href="#"
                    class="text-xs font-medium text-primario-600 hover:text-primario-700 transition-colors duration-200 flex items-center"
                    @click.prevent="showForgotPasswordNotification"
                  >
                    ¿Olvidaste tu contraseña?
                    <i class="fas fa-arrow-right ml-1 transform group-hover:translate-x-1 transition-all duration-200"/>
                  </a>
                </div>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200"
                  >
                    <i class="fas fa-lock text-gray-400 group-focus-within:text-primario-600 transition-colors duration-200"/>
                  </div>
                  <input
                    id="password"
                    v-model="credentials.contraseña"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="Ingrese su contraseña"
                    class="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-primario-500/20 focus:border-primario-500 transition-all duration-200 text-sm"
                    :class="{ 'bg-primario-50/50 border-primario-200': credentials.contraseña }"
                  >
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primario-600 transition-colors duration-200"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"/>
                  </button>
                </div>
              </div>

              <!-- Additional options -->
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer group">
                  <div class="relative flex items-center justify-center">
                    <input
                      id="remember-me"
                      v-model="rememberMe"
                      type="checkbox"
                      class="sr-only peer"
                    >
                    <div
                      class="w-5 h-5 bg-white border-2 border-gray-300 rounded-md peer-checked:bg-primario-600 peer-checked:border-primario-600 peer-focus:ring-2 peer-focus:ring-primario-600/30 transition-all duration-200"
                    />
                    <i class="fas fa-check absolute text-white scale-0 peer-checked:scale-100 transition-transform duration-200 text-[10px]"/>
                  </div>
                  <span class="group-hover:text-gray-800 transition-colors duration-200">Recordar sesión</span>
                </label>

                <a
                  href="#"
                  class="text-sm font-medium bg-primario-50 py-2 px-4 rounded-full text-primario-600 hover:text-primario-800 hover:bg-primario-100 transition-all duration-200 flex items-center gap-1 hover:gap-2"
                >
                  <span>Soporte</span>
                  <i class="fas fa-headset"/>
                </a>
              </div>

              <!-- Login button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="relative w-full flex justify-center items-center gap-3 py-3 px-6 mt-4 text-white bg-primario-700 hover:bg-primario-600 text-base font-medium rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
              >               
                <!-- Button content -->
                <div class="relative z-10 flex items-center justify-center gap-3">
                  <svg
                    v-if="isLoading"
                    class="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4zm2 5.3A8 8 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z"
                    />
                  </svg>
                  <span>{{ isLoading ? "Verificando..." : "Iniciar sesión" }}</span>
                  <i class="fas fa-arrow-right opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200"/>
                </div>
              </button>
            </form>

            <!-- Footer -->
            <div class="pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>Sistema desarrollado por el Área de Informática</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useNotification } from "~/composables/useNotification";

const { credentials, isLoading, error, login } = useAuth();
const notification = useNotification();

const showPassword = ref(false);
const rememberMe = ref(false);
const isHovered = ref(false);

// References for animation elements
const pageContainer = ref(null);
const headerContainer = ref(null);
const footerContainer = ref(null);
const formContainer = ref(null);

// Watch for errors to show notifications
watch(() => error.value, (newError) => {
  if (newError) {
    showNotification({
      title: "Error de acceso",
      message: newError,
      type: "error",
      duration: 4000,
    });
  }
});

// Notification function
const showNotification = (config) => {
  notification.show(config);
};

// Function to show "En proceso" notification for forgot password
const showForgotPasswordNotification = () => {
  showNotification({
    title: "Importante",
    message: "Recuerda que tu contraseña es tu DNI",
    type: "info",
    duration: 5000,
  });
};

// Animation function (simplified and faster)
const animateElements = async () => {
  // Fade in main container
  if (pageContainer.value) {
    pageContainer.value.classList.add('opacity-100');
  }
  
  // Wait a short time
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Animate form container
  if (formContainer.value) {
    formContainer.value.classList.add('opacity-100');
    formContainer.value.classList.remove('opacity-0', 'translate-y-4');
  }
  
  // Animate header & footer at the same time (desktop only)
  await new Promise(resolve => setTimeout(resolve, 150));
  if (headerContainer.value) {
    headerContainer.value.classList.add('opacity-100');
    headerContainer.value.classList.remove('opacity-0', 'translate-y-4');
  }
  
  if (footerContainer.value) {
    footerContainer.value.classList.add('opacity-100');
    footerContainer.value.classList.remove('opacity-0', 'translate-y-4');
  }
};

onMounted(async () => {
  // Trigger animations
  await nextTick();
  animateElements();

  // Load saved credentials if they exist
  if (import.meta.client) {
    const saved = localStorage.getItem("savedCredentials");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        credentials.usuario = parsed.usuario;
        credentials.contraseña = parsed.contraseña;
        rememberMe.value = true;
      } catch (e) {
        console.error("Error al cargar credenciales guardadas:", e);
        localStorage.removeItem("savedCredentials");
      }
    }
  }
});

const iniciarSesion = async () => {
  try {
    const success = await login();

    if (success) {
      showNotification({
        title: "Acceso correcto",
        message: "Bienvenido al Sistema Médico Integrado",
        type: "success",
        duration: 3000,
      });

      // Save or remove credentials based on checkbox
      if (import.meta.client) {
        if (rememberMe.value) {
          localStorage.setItem(
            "savedCredentials",
            JSON.stringify({
              usuario: credentials.usuario,
              contraseña: credentials.contraseña,
            })
          );
        } else {
          localStorage.removeItem("savedCredentials");
        }
      }
    }
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    // Error notification is handled by the watcher
  }
};

definePageMeta({
  layout: "login",
  middleware: [],
});
</script>

<style scoped>
/* Clean up styles */
input:-webkit-autofill {
  -webkit-text-fill-color: #111827 !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Focus styles */
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid rgba(10, 143, 237, 0.5);
  outline-offset: 2px;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .min-h-screen {
    padding: 0;
  }
}
</style>

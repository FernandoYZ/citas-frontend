<template>
  <div class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
    
    <div class="w-full max-w-md bg-white rounded-2xl overflow-hidden backdrop-blur-sm bg-opacity-90">
      <!-- Header con efecto de olas abstractas -->
      <div class="bg-[#00549c] relative overflow-hidden text-white px-6 py-8 text-center">
        <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik03NTAgNTAwQzY2MC44IDUwMCA1ODAgNDUwIDUwMCA0NTBjLTgwIDAtMTYwLjggNTAtMjUwIDUwUzEwMCA0MDAgMTAwIDMwMGMwLTIwMCAxMDAuOC0yMDAgMjAwLTIwMHMyMDAgMTAwIDMwMCAxMDAgMjAwLTEwMCAzMDAuOC0xMDBjMTAwIDAgMTAwIDEwMCAxMDAgMjAwIDAgMTAwLTEwMCAyMDAtMTQ5LjIgMjAweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')]"></div>
        
        <div class="relative z-10">
          <div class="w-24 h-24 mx-auto mb-4 p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <NuxtImg
              src="/logo.webp"
              alt="Logo del Hospital"
              class="w-full h-full object-contain"
            />
          </div>
          <h1 class="text-2xl font-bold tracking-tight">Hospital Regional de Cañete</h1>
          <p class="mt-2 text-sm text-blue-100 font-medium">Sistema Integrado Hospitalario</p>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="px-6 py-8 space-y-8">
        <!-- Alerta de error mejorada -->
        <div
          v-if="error"
          class="bg-red-50 text-red-700 text-sm rounded-lg p-4 border border-red-100 flex items-start gap-3"
        >
          <i class="fas fa-exclamation-circle mt-0.5" />
          <span>{{ error }}</span>
        </div>

        <!-- Formulario con líneas limpias -->
        <form class="space-y-6" @submit.prevent="iniciarSesion">
          <div class="space-y-5">
            <!-- Campo de usuario -->
            <div>
              <label for="usuario" class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <div class="relative">
                <i class="fas fa-user absolute left-4 top-3.5 text-gray-400 text-sm" />
                <input
                  id="usuario"
                  v-model="credentials.usuario"
                  type="text"
                  required
                  placeholder="Usuario"
                  class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-[#00549c] focus:ring-1 focus:ring-[#00549c] placeholder-gray-400 transition-all duration-200"
                >
              </div>
            </div>

            <!-- Campo de contraseña -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div class="relative">
                <i class="fas fa-lock absolute left-4 top-3.5 text-gray-400 text-sm" />
                <input
                  id="password"
                  v-model="credentials.contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Contraseña"
                  class="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-200 text-sm focus:border-[#00549c] focus:ring-1 focus:ring-[#00549c] placeholder-gray-400 transition-all duration-200"
                >
                <button
                  type="button"
                  class="absolute right-4 top-3.5 text-gray-400 hover:text-[#00549c] transition-colors"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-sm" />
                </button>
              </div>
            </div>
          </div>

          <!-- Checkbox y botón -->
          <div class="space-y-6">
            <label class="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 border-2 border-gray-300 rounded-sm checked:bg-[#00549c] checked:border-[#00549c] focus:ring-[#00549c] transition"
              >
              Recordar mis credenciales
            </label>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center items-center gap-3 py-3.5 px-6 text-white bg-[#00549c] hover:bg-[#004080] text-sm font-semibold rounded-lg transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isLoading"
                class="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4zm2 5.3A8 8 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z" />
              </svg>
              <span>{{ isLoading ? "Verificando..." : "Iniciar sesión" }}</span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div
          class="mt-8 text-center text-xs text-gray-500 border-t pt-4 border-gray-100"
        >
          <p>Desarrollado por el Área de Informática</p>
          <p class="mt-1">© {{ new Date().getFullYear() }} Hospital Rezola Cañete</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { credentials, isLoading, error, login } = useAuth(); // Asegúrate que `credentials` sea `reactive` y no `ref`

const showPassword = ref(false);
const rememberMe = ref(false);

// Cargar credenciales guardadas si existen
onMounted(() => {
  if (import.meta.client) {
    const saved = localStorage.getItem("savedCredentials");
    if (saved) {
      const parsed = JSON.parse(saved);
      credentials.usuario = parsed.usuario;
      credentials.contraseña = parsed.contraseña;
      rememberMe.value = true;
    }
  }
});

const iniciarSesion = async () => {
  try {
    await login();

    // Guardar o eliminar credenciales según el checkbox
    if (import.meta.client && rememberMe.value) {
      localStorage.setItem(
        "savedCredentials",
        JSON.stringify({
          usuario: credentials.usuario,
          contraseña: credentials.contraseña,
        })
      );
    } else if (import.meta.client) {
      localStorage.removeItem("savedCredentials");
    }
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
  }
};

definePageMeta({
  layout: "login",
  middleware: [],
});
</script>

<style scoped>
button,
input,
[type="checkbox"] {
  transition: all 0.15s ease;
}

/* Fix para autocompletado de navegador */
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px white inset !important;
  -webkit-text-fill-color: #111827 !important;
  transition: background-color 5000s ease-in-out 0s;
}

input.bg-blue-50:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #e5e7eb inset !important;
}
</style>

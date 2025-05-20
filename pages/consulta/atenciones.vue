<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        <i class="fas fa-user-alt text-blue-600 mr-2" />
        Gestión de Atenciones
      </h1>
      <p class="text-gray-600 mb-4">
        Esta es la página de gestión de pacientes. Aquí podrás ver que la
        navegación del sidebar funciona correctamente.
      </p>

      <div class="bg-blue-50 rounded-md p-4 border border-blue-200">
        <h2 class="text-lg font-semibold text-blue-800 mb-2">
          Esta página es un ejemplo
        </h2>
        <p class="text-blue-700">
          Este es un ejemplo para demostrar que el sidebar navega correctamente.
          Los iconos de FontAwesome deberían verse correctamente en el sidebar.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: () => {
    return navigateTo('/citas');
  }
});
</script>
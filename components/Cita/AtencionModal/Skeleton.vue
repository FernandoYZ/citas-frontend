<!-- components/Cita/AtencionModal/Skeleton.vue -->
<template>
  <div class="animate-pulse">
    <!-- Header con datos del paciente en skeleton -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center space-x-4 mb-3">
        <!-- Avatar skeleton -->
        <div class="h-10 w-10 bg-gray-200 rounded-full"/>
        
        <!-- Nombre e identificación skeleton -->
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"/>
          <div class="h-3 bg-gray-200 rounded w-1/3"/>
        </div>
      </div>

      <!-- Información adicional skeleton -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        <div v-for="i in 4" :key="i" class="flex flex-col">
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-1"/>
          <div class="h-4 bg-gray-200 rounded w-3/4"/>
        </div>
      </div>
    </div>

    <!-- Tabs de navegación skeleton -->
    <div class="flex border-b border-gray-200 bg-blue-50 rounded-t-lg overflow-hidden">
      <div v-for="i in 3" :key="i" class="px-4 py-2.5">
        <div class="h-4 bg-blue-200 rounded w-20"/>
      </div>
    </div>

    <!-- Contenido de tab skeleton -->
    <div class="p-5 space-y-4">
      <!-- Formulario de diagnóstico skeleton -->
      <div class="mb-4">
        <div class="h-4 bg-gray-200 rounded w-24 mb-2"/>
        <div class="h-20 bg-gray-100 rounded w-full"/>
      </div>
      
      <div class="mb-4">
        <div class="h-4 bg-gray-200 rounded w-36 mb-2"/>
        <div class="h-16 bg-gray-100 rounded w-full"/>
      </div>
      
      <!-- Diagnósticos skeleton -->
      <div class="mb-4">
        <div class="h-4 bg-gray-200 rounded w-32 mb-2"/>
        
        <div class="space-y-3">
          <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-md p-3 border border-gray-100">
            <div class="flex justify-between mb-2">
              <div class="h-4 bg-gray-200 rounded w-28"/>
              <div class="h-4 bg-gray-200 rounded w-20"/>
            </div>
            <div class="h-10 bg-gray-100 rounded w-full"/>
          </div>
        </div>
      </div>
      
      <!-- Tratamiento skeleton -->
      <div class="mb-4">
        <div class="h-4 bg-gray-200 rounded w-24 mb-2"/>
        <div class="h-20 bg-gray-100 rounded w-full"/>
      </div>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica adicional para el skeleton
</script>

<style scoped>
/* Animación de pulsación para el skeleton */
@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
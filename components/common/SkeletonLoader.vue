<!-- components/common/SkeletonLoader.vue -->
<template>
  <div class="animate-pulse">
    <div class="flex flex-col space-y-4">
      <div v-for="i in rows" :key="i" class="flex items-center">
        <!-- Celda de hora -->
        <div class="w-1/6 pr-2">
          <div class="flex items-center">
            <div class="rounded-full bg-gray-200 h-8 w-8 mr-2"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              <div class="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
        
        <!-- Celda de ID -->
        <div class="w-1/12 px-2">
          <div class="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        
        <!-- Celda de paciente -->
        <div class="w-1/6 px-2">
          <div class="h-4 bg-gray-200 rounded w-32 mb-1"></div>
          <div class="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        
        <!-- Celda de DNI -->
        <div class="w-1/12 px-2">
          <div class="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        <!-- Celda de servicio -->
        <div class="w-1/6 px-2 hidden md:block">
          <div class="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        
        <!-- Celda de médico -->
        <div class="w-1/6 px-2 hidden md:block">
          <div class="h-4 bg-gray-200 rounded w-24 mb-1"></div>
          <div class="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        
        <!-- Celda de triaje -->
        <div class="w-1/12 px-2">
          <div class="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        
        <!-- Celda de estado -->
        <div class="w-1/12 px-2">
          <div class="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        
        <!-- Celda de acciones -->
        <div class="w-1/12 px-2 flex justify-end">
          <div class="h-8 w-8 bg-gray-200 rounded-md mr-2"></div>
          <div class="h-8 w-8 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rows: {
    type: Number,
    default: 5
  }
});
</script>
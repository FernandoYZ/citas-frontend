<!-- components/common/Search.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-xs p-4 mb-4"
  >
    <header class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-800">{{ title }}</h1>
          <p class="text-sm text-gray-600 mt-1">
            <slot name="subtitle"/>
          </p>
        </div>
        <slot name="header-actions"/>
      </div>
    </header>

    <!-- Search Form Body -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <slot />

      <div v-if="showClearButton || showSearchButton" class="flex items-center">
        <button
          v-if="showClearButton"
          class="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-150 flex items-center whitespace-nowrap"
          @click="$emit('clear')"
        >
          <i class="fas fa-eraser mr-1.5"/>
          {{ clearButtonText }}
        </button>
        <button
          v-if="showSearchButton"
          class="px-3 py-2 ml-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center"
          @click="$emit('search')"
        >
          <i class="fas fa-search mr-2"/>
          {{ searchButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Búsqueda avanzada",
  },
  icon: {
    type: String,
    default: "fa-search",
  },
  showClearButton: {
    type: Boolean,
    default: true,
  },
  clearButtonText: {
    type: String,
    default: "Limpiar",
  },
  showSearchButton: {
    type: Boolean,
    default: false,
  },
  searchButtonText: {
    type: String,
    default: "Buscar",
  },
});

defineEmits(["clear", "search"]);
</script>
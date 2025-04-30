<!-- components/common/Table/Pagination.vue -->
<template>
  <div v-if="enabled" class="px-4 py-3 bg-gray-50 border-t border-gray-200">
    <div class="flex flex-wrap items-center justify-between">
      <!-- Selector de filas por página y resumen de resultados -->
      <div class="flex items-center space-x-2">
        <select
          :value="rowsPerPage"
          class="pl-2 pr-6 py-1 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          @change="$emit('update:rowsPerPage', parseInt($event.target.value))"
        >
          <option v-for="opt in rowsPerPageOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
        <p class="text-xs text-gray-600">
          Mostrando <span class="font-medium">{{ startIndex + 1 }}</span> a
          <span class="font-medium">{{ Math.min(endIndex, totalItems) }}</span>
          de <span class="font-medium">{{ totalItems }}</span> resultados
        </p>
      </div>

      <!-- Controles de paginación -->
      <div class="mt-2 sm:mt-0">
        <nav class="flex items-center space-x-1" aria-label="Pagination">
          <!-- Botón página anterior -->
          <button
            class="px-2 py-1 text-sm rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <i class="fas fa-chevron-left text-xs" />
          </button>

          <!-- Números de página -->
          <template v-for="page in paginationRange" :key="page">
            <span
              v-if="page === '...'"
              class="px-3 py-1 text-sm border border-gray-300 bg-white text-gray-700"
            >
              ...
            </span>
            <button
              v-else
              class="px-3 py-1 text-sm rounded border text-gray-700 hover:bg-gray-50"
              :class="
                page === currentPage
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 bg-white'
              "
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </template>

          <!-- Botón página siguiente -->
          <button
            class="px-2 py-1 text-sm rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            :class="{
              'opacity-50 cursor-not-allowed': currentPage === totalPages,
            }"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            <i class="fas fa-chevron-right text-xs" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  rowsPerPage: {
    type: Number,
    default: 10,
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 25, 50, 100],
  },
});

const emit = defineEmits(["update:currentPage", "update:rowsPerPage"]);

// Cálculos para paginación
const startIndex = computed(() => (props.currentPage - 1) * props.rowsPerPage);
const endIndex = computed(() => startIndex.value + props.rowsPerPage);
const totalPages = computed(
  () => Math.ceil(props.totalItems / props.rowsPerPage) || 1
);

// Cambiar de página
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  emit("update:currentPage", page);
};

// Calcular rango de páginas para la paginación
const paginationRange = computed(() => {
  const totalPagesValue = totalPages.value;
  const currentPageValue = props.currentPage;

  if (totalPagesValue <= 7) {
    return Array.from({ length: totalPagesValue }, (_, i) => i + 1);
  }

  // Mostrar páginas clave con elipsis
  const pages = [];
  if (currentPageValue <= 3) {
    // Primeras 3 páginas
    for (let i = 1; i <= 3; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPagesValue);
  } else if (currentPageValue >= totalPagesValue - 2) {
    // Últimas 3 páginas
    pages.push(1);
    pages.push("...");
    for (let i = totalPagesValue - 2; i <= totalPagesValue; i++) pages.push(i);
  } else {
    // Páginas intermedias
    pages.push(1);
    pages.push("...");
    pages.push(currentPageValue - 1);
    pages.push(currentPageValue);
    pages.push(currentPageValue + 1);
    pages.push("...");
    pages.push(totalPagesValue);
  }

  return pages;
});
</script>

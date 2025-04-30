<template>
  <nav class="flex text-sm sm:text-base" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li>
        <a href="#" class="text-gray-500 hover:text-blue-600">
          {{ primaryBreadcrumb }}
        </a>
      </li>
      <li v-if="secondaryBreadcrumb" class="flex items-center">
        <svg
          class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="ml-2 text-gray-700 font-medium">
          {{ secondaryBreadcrumb }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useSidebarStore } from '~/stores/sidebar';

const sidebarStore = useSidebarStore();

// Usar los estados "active" ya definidos en el store para simplificar la lógica
const primaryBreadcrumb = computed(() => {
  for (const section of sidebarStore.sections) {
    for (const module of section.modules) {
      if (module.active) return module.title;
    }
  }
  return 'Inicio';
});

const secondaryBreadcrumb = computed(() => {
  for (const section of sidebarStore.sections) {
    for (const module of section.modules) {
      if (module.submodules) {
        for (const submodule of module.submodules) {
          if (submodule.active) return submodule.title;
        }
      }
    }
  }
  return '';
});
</script>

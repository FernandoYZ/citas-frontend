<!-- components/common/Table/Body.vue -->
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <!-- Cabeceras de columnas -->
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            :class="{ 'hidden md:table-cell': column.responsive }"
          >
            <div class="flex items-center space-x-1">
              <span>{{ column.label }}</span>
              <button
                v-if="enableSort && column.sortable !== false"
                class="text-gray-400 hover:text-gray-600"
                @click="handleSort(column.key)"
              >
                <i class="fas" :class="getSortIconClass(column.key)" />
              </button>
            </div>
          </th>
          <th
            v-if="$slots.rowActions"
            scope="col"
            class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Acciones
          </th>
        </tr>
      </thead>

      <!-- Cuerpo de la tabla -->
      <tbody class="bg-white divide-y divide-gray-200">
        <slot
          v-for="(item, index) in items"
          :key="getItemKey(item, index)"
          :item="item"
          :index="index"
          name="row"
        >
          <!-- Contenido por defecto si no se usa el slot row -->
          <tr class="hover:bg-gray-50">
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3"
              :class="{ 'hidden md:table-cell': column.responsive }"
            >
              <template v-if="column.template">
                <slot
                  :name="`column-${column.key}`"
                  :item="item"
                  :value="item[column.key]"
                >
                  {{ item[column.key] }}
                </slot>
              </template>
              <template v-else-if="column.formatter">
                {{ column.formatter(item[column.key], item) }}
              </template>
              <template v-else>
                {{ item[column.key] }}
              </template>
            </td>
            <td
              v-if="$slots.rowActions"
              class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium"
            >
              <slot name="rowActions" :item="item" :index="index" />
            </td>
          </tr>
        </slot>

        <!-- Mensaje cuando no hay datos -->
        <tr v-if="items.length === 0">
          <td
            :colspan="$slots.rowActions ? columns.length + 1 : columns.length"
            class="px-4 py-8 text-center text-gray-500"
          >
            <div class="flex flex-col items-center justify-center">
              <i class="fas fa-search text-4xl mb-3 text-gray-300" />
              <p class="text-lg font-medium">{{ emptyMessage }}</p>
              <p v-if="emptyDescription" class="text-sm">
                {{ emptyDescription }}
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>

const props = defineProps({
  // Datos
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  itemKey: {
    type: String,
    default: "id",
  },

  // Ordenamiento
  enableSort: {
    type: Boolean,
    default: true,
  },
  sortKey: {
    type: String,
    default: "",
  },
  sortDirection: {
    type: String,
    default: "asc",
  },

  // Mensajes de estado vacío
  emptyMessage: {
    type: String,
    default: "No se encontraron registros",
  },
  emptyDescription: {
    type: String,
    default: "Intenta ajustar los filtros de búsqueda",
  },
});

const emit = defineEmits(["sort"]);

// Función para obtener llave única para cada fila
const getItemKey = (item, index) => {
  return item[props.itemKey] || index;
};

// Función para manejar el ordenamiento
const handleSort = (key) => {
  let direction = "asc";

  if (props.sortKey === key) {
    direction = props.sortDirection === "asc" ? "desc" : "asc";
  }

  emit("sort", { key, direction });
};

// Función para obtener el icono de ordenamiento
const getSortIconClass = (key) => {
  if (props.sortKey !== key) return "fa-sort";
  return props.sortDirection === "asc" ? "fa-sort-up" : "fa-sort-down";
};
</script>

<style>
/* Transición para campos de error */
input:focus:not(.error),
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

input:focus.error {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
}
</style>

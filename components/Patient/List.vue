<!-- components/patient/List.vue  -->
<template>
  <CommonTable
    v-model:sort-key="sortConfig.key"
    v-model:sort-direction="sortConfig.direction"
    :items="pacientes"
    :columns="columns"
    title="Lista de pacientes"
    icon="fa-user-injured"
    :export-filename="pacientes"
    @sort="onSort"
  >
    <!-- Personalización de filas -->
    <template #row="{ item }">
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-3">
          <div class="flex items-center">
            <div>
              <div class="text-xs font-medium text-gray-900">
                {{ item.apellidos }}
              </div>
              <div class="text-xs text-gray-500">{{ item.nombres }}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="text-sm font-medium text-blue-600 hover:text-blue-800">
            {{ item.historia }}
          </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="text-sm font-medium">
            {{ item.dni }}
          </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
          {{ item.edad }} años
          <div class="text-xs text-gray-500">{{ item.fechaNacimiento }}</div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
          {{ item.fechaIngreso }}
        </td>
        <td class="px-4 py-3 whitespace-nowrap hidden md:table-cell">
          <div class="text-sm text-gray-900">{{ item.ultimaAtencion }}</div>
          <div class="text-xs text-gray-500">
            {{ item.fechaUltimaAtencion }}
          </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="text-sm font-medium">
            {{ item.especialidad }}
          </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
          <div class="flex space-x-2 justify-end">
            <button
              class="p-1.5 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              title="Ver historial"
              @click="$emit('view', item)"
            >
              <i class="fas fa-eye" />
            </button>
            <button
              class="p-1.5 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              title="Editar paciente"
              @click="$emit('edit', item)"
            >
              <i class="fas fa-edit" />
            </button>
          </div>
        </td>
      </tr>
    </template>
  </CommonTable>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  pacientes: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  "view",
  "edit",
  "delete",
  "sort",
]);


// Configuración para ordenamiento
const sortConfig = ref({
  key: "",
  direction: "asc",
});


// Definición de columnas con formateadores para exportación
const columns = [
  { key: "apellidos", label: "Paciente" },
  { key: "historia", label: "N° Historia" },
  { key: "dni", label: "N° DNI" },
  { key: "edad", label: "Edad" },
  { key: "fechaIngreso", label: "Fecha Ingreso" },
  { key: "ultimaAtencion", label: "Última Atención", responsive: true },
  { key: "especialidad", label: "Especialidad" },
  { key: "acciones", label: "Acciones" },
];

// Eventos
const onSort = (sortData) => {
  emit("sort", sortData);
};

</script>

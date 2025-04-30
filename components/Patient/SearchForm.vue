<!-- components/patient/SearchForm.vue -->
<template>
  <CommonSearch
    title="Pacientes"
    :show-search-button="false"
    @clear="clearForm"
  >
    <template #subtitle>Gestión de pacientes</template>
    
    <template #header-actions>
      <CommonButton
        variant="primary"
        icon-left="fa-plus"
        label="Nuevo Paciente"
        @click="openNewPatientForm"
      />
    </template>
    
    <!-- First column -->
    <CommonFormField
      v-model="filters.nombre"
      placeholder="Nombre del paciente"
      icon="fa-user"
    />

    <!-- Second column -->
    <CommonFormField
      v-model="filters.dni"
      placeholder="N° DNI"
      icon="fa-id-card"
    />

    <!-- Third column -->
    <CommonFormField
      v-model="filters.historia"
      placeholder="N° Historia Clínica"
      icon="fa-file-medical"
    />
  </CommonSearch>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({
      nombre: "",
      dni: "",
      historia: "",
    }),
  },
});

const emit = defineEmits(["search", "update:filters", "clear"]);

// Local filter state
const filters = ref({ ...props.initialFilters });

// Notify filter changes
watch(
  filters,
  (newValue) => {
    emit("update:filters", newValue);
    emit("search", newValue);
  },
  { deep: true }
);

// Method to clear form
const clearForm = () => {
  filters.value = {
    nombre: "",
    dni: "",
    historia: "",
  };
  emit("clear");
};

// Define this method to avoid errors
const openNewPatientForm = () => {
  // This would be implemented in the actual component
  console.log("Open new patient form");
};
</script>
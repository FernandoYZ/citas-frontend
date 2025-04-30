<!-- Pages/pacientes.vue (Actualizado) -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-4">
    <div>
      <!-- Panel Búsqueda -->
      <PatientSearchForm
        v-model:filters="searchFilters"
        @clear="clearFilters"
      >
        <template #header-actions>
          <CommonButton
            variant="primary"
            size="md"
            icon-left="fa-plus"
            label="Nuevo paciente"
            @click="openNewPatientForm"
          />
        </template>
      </PatientSearchForm>

      <!-- Tabla de Pacientes -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mt-4">
        <PatientList
          :pacientes="filteredPatients"
          @view="viewPatient"
          @edit="editPatient"
          @sort="handleSort"
        />
      </div>
    </div>

    <!-- Patient Detail Modal -->
    <PatientDetailModal
      v-if="showPatientModal"
      v-model:visible="showPatientModal"
      :patient="selectedPatient"
      @view-history="viewFullHistory"
      @action="handlePatientAction"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { DatosPruebaPaciente } from "~/models/pacientes"

// Importar datos de muestra (en un caso real, se usaría una API)
const dataPacientes = ref(DatosPruebaPaciente);

// Estado para búsqueda y filtrado
const searchFilters = ref({
  nombre: "",
  dni: "",
  historia: "",
  tipo: "",
});
const tableSearch = ref("");
const sortBy = ref({ key: "", direction: "asc" });

// Estado para el modal de detalle
const showPatientModal = ref(false);
const selectedPatient = ref(null);

// Filtrar pacientes combinando filtros externos y búsqueda en tabla
const filteredPatients = computed(() => {
  let result = dataPacientes.value;

  // Aplicar filtros de la sección de búsqueda
  if (searchFilters.value.nombre) {
    const searchTerm = searchFilters.value.nombre.toLowerCase();
    result = result.filter(
      (p) =>
        (p.apellidos && p.apellidos.toLowerCase().includes(searchTerm)) ||
        (p.nombres && p.nombres.toLowerCase().includes(searchTerm))
    );
  }

  if (searchFilters.value.dni) {
    const searchTerm = searchFilters.value.dni.toLowerCase();
    result = result.filter(
      (p) => p.dni && p.dni.toLowerCase().includes(searchTerm)
    );
  }

  if (searchFilters.value.historia) {
    const searchTerm = searchFilters.value.historia.toLowerCase();
    result = result.filter(
      (p) => p.historia && p.historia.toLowerCase().includes(searchTerm)
    );
  }

  if (searchFilters.value.tipo) {
    const searchTerm = searchFilters.value.tipo.toLowerCase();
    result = result.filter(
      (p) => p.tipo && p.tipo.toLowerCase().includes(searchTerm)
    );
  }

  // Aplicar búsqueda de la tabla
  if (tableSearch.value) {
    const searchTerm = tableSearch.value.toLowerCase();
    result = result.filter(
      (p) =>
        (p.apellidos && p.apellidos.toLowerCase().includes(searchTerm)) ||
        (p.nombres && p.nombres.toLowerCase().includes(searchTerm)) ||
        (p.historia && p.historia.toLowerCase().includes(searchTerm)) ||
        (p.dni && p.dni.toLowerCase().includes(searchTerm)) ||
        (p.especialidad && p.especialidad.toLowerCase().includes(searchTerm))
    );
  }

  // Aplicar ordenamiento si está activo
  if (sortBy.value.key) {
    result = [...result].sort((a, b) => {
      const valueA = a[sortBy.value.key];
      const valueB = b[sortBy.value.key];
      
      // Comparar según tipo de datos
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortBy.value.direction === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        // Para números y otros tipos
        return sortBy.value.direction === 'asc' 
          ? (valueA > valueB ? 1 : -1)
          : (valueA < valueB ? 1 : -1);
      }
    });
  }

  return result;
});

const clearFilters = () => {
  // Limpiar todos los filtros
  searchFilters.value = {
    nombre: "",
    dni: "",
    historia: "",
    tipo: "",
  }
};

const handleSort = (sortData) => {
  sortBy.value = sortData;
};

const openNewPatientForm = () => {
  // Implementación para abrir formulario de nuevo paciente
  // Por ejemplo, puede navegar a una ruta o abrir un modal
  // navigateTo('/pacientes/nuevo');
};

const viewPatient = (patient) => {
  selectedPatient.value = patient;
  showPatientModal.value = true;
};

const editPatient = (patient) => {
  // Implementación para editar paciente
  // Por ejemplo, puede navegar a una ruta o abrir un modal
  navigateTo(`/pacientes/${patient.id}/editar`);
};

const viewFullHistory = (patient) => {
  // Implementación para ver historial completo
  navigateTo(`/pacientes/${patient.id}/historial`);
};

const handlePatientAction = (action, patient) => {
  // Manejar diferentes acciones según el valor de 'action'
  switch (action) {
    case 'edit':
      editPatient(patient);
      break;
    case 'viewHistory':
      viewFullHistory(patient);
      break;
    default:
      console.warn(`Acción no implementada: ${action}`);
  }
};

</script>
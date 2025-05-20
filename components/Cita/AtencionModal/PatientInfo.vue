<!-- components/Cita/AtencionModal/PatientInfo.vue -->
<template>
  <div
    class="bg-gray-50 rounded-lg border border-gray-200 p-3 flex flex-wrap md:flex-nowrap md:justify-between items-center"
  >
    <div class="flex items-center space-x-3">
      <div
        class="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700"
      >
        <i class="fas fa-user-circle" />
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-800 capitalize">
          {{ cita.ApellidosPaciente }}, {{ cita.NombresPaciente }}
        </h3>
        <div class="flex space-x-5 text-xs text-gray-500 mt-0.5">
          <div>
            <span class="font-medium">N° Cuenta:</span>
            {{ cita.IdAtencion || "No asignado" }}
          </div>
          <div class="capitalize">
            <span class="font-medium">Especialidad:</span>
            {{ cita.Servicio }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cita: {
    type: Object,
    default: () => ({}),
  },
});
</script>

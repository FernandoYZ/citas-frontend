<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        <i class="fas fa-home text-blue-600 mr-2"/>
        Bienvenido al Sistema Integrado Hospitalario
      </h1>
      
      <p class="text-gray-600 mb-6">
        Por favor, selecciona un módulo del sidebar para comenzar a navegar por el sistema.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 rounded-md p-4 border border-blue-200 hover:shadow-md transition-shadow">
          <h2 class="text-lg font-semibold text-blue-800 mb-2">
            <i class="fas fa-hospital-user mr-2"/>
            Consulta Externa
          </h2>
          <p class="text-blue-700 text-sm">
            Gestión de pacientes, citas, triaje y atenciones.
          </p>
        </div>
        
        <div class="bg-red-50 rounded-md p-4 border border-red-200 hover:shadow-md transition-shadow">
          <h2 class="text-lg font-semibold text-red-800 mb-2">
            <i class="fas fa-ambulance mr-2"/>
            Emergencia
          </h2>
          <p class="text-red-700 text-sm">
            Atención de emergencias y urgencias médicas.
          </p>
        </div>
        
        <div class="bg-green-50 rounded-md p-4 border border-green-200 hover:shadow-md transition-shadow">
          <h2 class="text-lg font-semibold text-green-800 mb-2">
            <i class="fas fa-procedures mr-2"/>
            Hospitalización
          </h2>
          <p class="text-green-700 text-sm">
            Gestión de pacientes hospitalizados.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSidebarStore } from '~/stores/sidebar';

// Asegurarse de que al cargar la página de inicio se muestre el sidebar correctamente
const sidebarStore = useSidebarStore();

// Se podría configurar el estado inicial del sidebar para la página de inicio
// Por ejemplo, para que no haya ningún módulo activo específicamente
onMounted(() => {
  // Esta función resetea todos los estados activos
  // Pero mantiene el estado de expansión actual
  sidebarStore.resetActiveStates();
  
  // Alternativamente, podrías activar un módulo específico si quieres
  // Por ejemplo, mantener "Consulta Externa" y "Paciente" como activos
  for (const section of sidebarStore.sections) {
    for (const module of section.modules) {
      if (module.id === 'consulta') {
        module.active = true;
        if (module.submodules) {
          const pacienteSubmodule = module.submodules.find(sub => sub.id === 'paciente');
          if (pacienteSubmodule) {
            pacienteSubmodule.active = true;
          }
        }
      }
    }
  }
});
</script>
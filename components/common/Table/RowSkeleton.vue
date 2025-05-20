<!-- components/common/TableRowSkeleton.vue -->
<template>
  <tr class="animate-pulse">
    <!-- ID Atención -->
    <td class="px-4 py-3 w-[8%]">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-full bg-gray-200" />
        <div class="h-4 w-12 bg-gray-200 rounded" />
      </div>
    </td>

    <!-- Fecha y Hora -->
    <td class="px-4 py-3 w-[12%]">
      <div class="flex flex-col">
        <div class="h-4 w-20 bg-gray-200 rounded mb-1" />
        <div class="h-3 w-16 bg-gray-200 rounded" />
      </div>
    </td>

    <!-- Paciente -->
    <td class="px-4 py-3 w-[18%]">
      <div class="flex flex-col">
        <div class="h-4 w-32 bg-gray-200 rounded mb-1" />
        <div class="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </td>

    <!-- Edad -->
    <!-- <td class="px-4 py-3 w-[5%]">
      <div class="h-4 w-14 bg-gray-200 rounded" />
    </td>
    -->

    <!-- DNI -->
    <td class="px-4 py-3 w-[10%]">
      <div class="h-4 w-16 bg-gray-200 rounded" />
    </td>

    <!-- Servicio - Oculto en móviles -->
    <td class="px-4 py-3 hidden sm:table-cell w-[15%]">
      <div class="h-4 w-28 bg-gray-200 rounded" />
    </td>

    <!-- Médico - Oculto en móviles y tablets pequeñas -->
    <td class="px-4 py-3 hidden md:table-cell w-[18%]">
      <div class="flex flex-col">
        <div class="h-4 w-20 bg-gray-200 rounded mb-1" />
        <div class="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </td>

    <!-- Triaje -->
    <td class="px-2 py-3 w-[10%]">
      <div class="h-5 w-20 bg-gray-200 rounded-full" />
    </td>

    <!-- Estado -->
    <td class="px-2 py-3 w-[7%]">
      <div class="h-5 w-16 bg-gray-200 rounded-full" />
    </td>

    <!-- Acciones -->
    <td class="px-4 py-3 text-right w-[10%]">
      <div class="flex justify-end space-x-1">
        <div class="h-8 w-16 bg-gray-200 rounded-lg" />
        <div v-if="showActions" class="h-8 w-16 bg-gray-200 rounded-lg" />
      </div>
    </td>
  </tr>
</template>

<script setup>
defineProps({
  showActions: {
    type: Boolean,
    default: false,
  },
});
</script>
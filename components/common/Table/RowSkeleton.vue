<!-- components/common/TableRowSkeleton.vue -->
<template>
  <tr class="animate-pulse">
    <td class="px-4 py-3">
      <div class="flex items-center space-x-4">
        <div class="h-9 w-9 rounded-full bg-gray-200"/>
        <div class="flex flex-col">
          <div class="h-4 w-20 bg-gray-200 rounded mb-1"/>
          <div class="h-3 w-16 bg-gray-200 rounded"/>
        </div>
      </div>
    </td>
    <td class="px-4 py-3"><div class="h-4 w-12 bg-gray-200 rounded"/></td>
    <td class="px-4 py-3">
      <div class="flex flex-col">
        <div class="h-4 w-24 bg-gray-200 rounded mb-1"/>
        <div class="h-3 w-16 bg-gray-200 rounded"/>
      </div>
    </td>
    <td class="px-4 py-3"><div class="h-4 w-16 bg-gray-200 rounded"/></td>
    <td class="px-4 py-3 hidden md:table-cell"><div class="h-4 w-32 bg-gray-200 rounded"/></td>
    <td class="px-4 py-3 hidden md:table-cell">
      <div class="flex flex-col">
        <div class="h-4 w-20 bg-gray-200 rounded mb-1"/>
        <div class="h-3 w-24 bg-gray-200 rounded"/>
      </div>
    </td>
    <td class="px-4 py-3"><div class="h-5 w-20 bg-gray-200 rounded-full"/></td>
    <td class="px-4 py-3"><div class="h-5 w-20 bg-gray-200 rounded-full"/></td>
    <td v-if="showActions" class="px-4 py-3 text-right">
      <div class="flex justify-end space-x-2">
        <div class="h-8 w-8 bg-gray-200 rounded-md"/>
        <div class="h-8 w-8 bg-gray-200 rounded-md"/>
      </div>
    </td>
  </tr>
</template>

<script setup>
defineProps({
  showActions: {
    type: Boolean,
    default: false
  }
});
</script>